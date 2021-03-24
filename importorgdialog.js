importOrgDialog


import React, { useState } from 'react';
import styled from 'styled-components';
import { Input, Table, Upload } from 'antd';
import { Button, useCoreStores } from 'teespace-core';
import XLSX from 'xlsx';
import { useObserver } from 'mobx-react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { excel } from '../../assets';
import useStores from '../../hooks/UseStores';
import { ImportOrgDialogStyle } from '../../styles/dialogStyle';
import { SuccessModal } from '../common/CustomModal';
import ImportOrgTableDialog from './ImportOrgTableDialog';

const OrgButtonStyle = styled(Button)`
  background: #ffffff;
  border: 1px solid #c6ced6;
  border-radius: 15px;
  border-radius: 15px;
`;

const OrgFileInputStyle = styled(Input)`
  border: 1px solid #c6ced6;
  border-radius: 25px;
  border-radius: 25px;
  width: 20rem;
`;
const { Dragger } = Upload;
const ImportOrgDialog = ({ title, visible }) => {
  const { UiStore, OrgDialogStore } = useStores();
  const { authStore } = useCoreStores();
  // TODO: file useState 합치기
  const [fileName, setFileName] = useState('파일 없음');
  const [fileContent, setFileContent] = useState([]);
  const [importFile, setImportFile] = useState([]);
  const [changeDialog, setChangeDialog] = useState(false);
  const [exportFile, setExportFile] = useState([]);
  const convertXlsx = file => {
    const buf = new ArrayBuffer(file.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < file.length; i += 1) {
      view[i] = file.charCodeAt(i) & 0xff;
    }
    return buf;
  };
  const convertXlsxData = file => {
    const mapper = item => {
      return {
        '조직 이름': item.orgName,
        '조직 부서코드': item.departmentCode ? item.departmentCode : null,
        '상위 조직 부서코드': item.parentDepartmentCode
          ? item.parentDepartmentCode
          : '',
        '조직 레벨': item.orgLevel === null ? '' : item.orgLevel,
      };
    };

    return file.map(mapper);
  };
  const handleOk = async files => {
    // const res = await OrgDialogStore.setOrgChartImport(importFile);
    // if (res) {
    //   console.log('조직도 import 성공');
    //   UiStore.closeVisibleOrgImportDialog();
    //   setFileName('파일 없음');
    //   setFileContent('');
    // } else {
    //   SuccessModal(
    //     {
    //       title: '파일이 유효하지 않습니다.',
    //       content: '샘플 파일을 확인하신 후 다시 시도해주세요.',
    //       okText: '확인',
    //       hasCancel: 'text',
    //     },
    //     () => {},
    //     () => {},
    //   );
    // }
    if (!changeDialog) setChangeDialog(true);
    else {
      console.log('example :', exportFile);
      const convertFile = convertXlsxData(exportFile);
      console.log('exportFile :', convertFile);
      const workBook = XLSX.utils.book_new();
      const workSheet = XLSX.utils.json_to_sheet(convertFile);
      workSheet['!cols'] = [
        { wpx: 70 },
        { wpx: 100 },
        { wpx: 100 },
        { wpx: 70 },
      ];
      XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetJS');
      const xlsxFile = XLSX.write(workBook, {
        bookType: 'xlsx',
        type: 'binary',
      });
      // XLSX.writeFile(workBook, 'OrgList.xlsx'); 엑셀양식 확인용
      const data = new Blob([convertXlsx(xlsxFile)], {
        type: 'application/octet-stream',
      });
      const reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onloadend = async () => {
        const base64String = reader.result;
        const res = await OrgDialogStore.setOrgChartImport({
          filename: 'orgList.xlsx',
          contents: base64String.substr(base64String.indexOf('base64,') + 7),
        });
        if (res) {
          UiStore.closeVisibleOrgImportDialog();
        }
      };
    }
  };
  const handleCancel = () => {
    UiStore.closeVisibleOrgImportDialog();
    OrgDialogStore.orgImport = [];
    OrgDialogStore.setFiles([]);
    setFileName('파일 없음');
    setFileContent('');
  };
  const convertTableData = data => {
    const result = [];
    data.map((org, index) => {
      result.push({
        key: `org_${index}`,
        orgName: org['조직 이름'],
        departmentCode: org['조직 부서코드'],
        parentDepartmentCode: org['상위 조직 부서코드'],
        orgLevel: org['조직 레벨'],
      });
    });
    return result;
  };
  const props = {
    selectFormatFile: (info, callback) => {
      const reader = new FileReader();
      const fileName = info.name;
      reader.readAsArrayBuffer(info);
      reader.onload = function (info) {
        const data = info.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        const bytes = new Uint8Array(data);
        let binary = '';
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const fileContent = btoa(binary);
        if (typeof callback === 'function') callback(fileName, fileContent);
      };
    },
    multiple: false,
    beforeUpload: async file => {
      const fileExtension = OrgDialogStore.validateFileType(file.name);
      if (!fileExtension) {
        SuccessModal(
          {
            title: '파일 형식이 올바르지 않습니다.',
            content: 'xls 파일로 등록해주세요.',
            okText: '확인',
            hasCancel: 'text',
          },
          () => {},
          () => {},
        );
        return;
      }
      let xlsxFileObj = {};
      let orgData = [];

      props.selectFormatFile(file, async (_fileName, _fileContent) => {
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function (file) {
          const data = file.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetJson = XLSX.utils.sheet_to_json(workbook.Sheets['조직도']);
          orgData = convertTableData(sheetJson);
        };
        xlsxFileObj = {
          filename: _fileName,
          contents: _fileContent,
          ORG_URL: authStore.sessionInfo.domainKey,
        };
        const filevaildate = await OrgDialogStore.validateOrgImportFile(
          xlsxFileObj,
        );
        if (filevaildate === 'RST0002') {
          SuccessModal(
            {
              title: '파일이 유효하지 않습니다.',
              content: '샘플 파일을 확인하신 후 다시 시도해주세요.',
              okText: '확인',
              hasCancel: 'text',
            },
            () => {},
            () => {},
          );
        }
        if (filevaildate === 'ALL0001') {
          SuccessModal(
            {
              title: '유효하지 않은 값입니다.',
              content: '샘플 파일을 확인하신 후 다시 시도해주세요.',
              okText: '확인',
              hasCancel: 'text',
            },
            () => {},
            () => {},
          );
        }
        // OrgDialogStore.setFiles(xlsxFileObj);
        setImportFile(xlsxFileObj);
        setFileName(file.name);
        setFileContent(orgData);
      });
    },
  };
  return useObserver(() => {
    return (
      <>
        <ImportOrgDialogStyle
          title={title}
          visible={visible}
          width={1000}
          // height="1rem"
          centered
          destroyOnClose
          footer={
            changeDialog ? (
              <>
                {' '}
                <Button type="solid" onClick={handleOk}>
                  조직도 업로드하기
                </Button>
                <Button type="outlined" onClick={handleCancel}>
                  취소
                </Button>
              </>
            ) : (
              <>
                <Button type="solid" onClick={handleOk}>
                  다음
                </Button>
                ,
                <Button type="outlined" onClick={handleCancel}>
                  취소
                </Button>
              </>
            )
          }
          onCancel={handleCancel}
        >
          {changeDialog && (
            <ImportOrgTableDialog
              fileContent={fileContent}
              error={[
                { row: 'org_1', reason: 'ERR0002' },
                { row: 'org_2', reason: 'ERR0002' },
              ]}
              handleUpload={setExportFile}
            />
          )}
          {changeDialog === false && (
            <div>
              <div className="org-import-title">
                양식을 다운로드 받아 조직 데이터를 작성해주세요.
              </div>
              <div className="org-import-steps">
                <OrgButtonStyle shape="round">
                  <Link
                    to="/files/OrgImportFormat.xlsx"
                    target="_blank"
                    download
                  >
                    조직도 일괄추가 양식 다운로드
                  </Link>
                </OrgButtonStyle>
                <Dragger {...props} showUploadList={false}>
                  {importFile.length === 0 ? (
                    <p className="file-upload-title">
                      마우스로 파일을 끌어올 수 있습니다.
                    </p>
                  ) : (
                    <div>
                      <img
                        alt=""
                        src={excel}
                        style={{ padding: '0 0.25rem 0.188rem 0' }}
                      />
                      {fileName}
                    </div>
                  )}
                  <OrgButtonStyle shape="round">양식 등록하기</OrgButtonStyle>
                </Dragger>
              </div>
              <div className="tips-title">TIP</div>
              <div className="tips-list">
                <ul>
                  <li>조직 일괄추가 양식을 다운로드 받으세요.</li>
                  <li>샘플 양식에 맞춰 조직정보를 작성해 주세요.</li>
                </ul>
              </div>
            </div>
          )}
        </ImportOrgDialogStyle>
      </>
    );
  });
};
export default ImportOrgDialog;