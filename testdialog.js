import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Table, Modal, Input } from 'antd';
import useStores from '../../hooks/UseStores';

const TestDialog = ({ title, visible, onCancel, onSuccess }) => {
  const { OrgDialogStore, OrgTreeStore } = useStores();
  const [data, setData] = useState([
    {
      key: 1,
      loginId: { value: 'id1', error: 'error1' },
      password: { value: 'pw1', error: 'error1' },
      name: { value: 'name1' },
      departmentName: { value: 'departmentName1' },
      departmentCode: { value: 'departmentCode1' },
      employPosition: { value: 'employPosition1' },
      employJob: { value: 'employJob1' },
      employType: { value: 'employType1' },
      companyPhoneNum: { value: 'companyPhoneNum1' },
      phoneNum: { value: 'phoneNume', error: 'error1' },
      birthday: { value: 'birthday1' },
    },

    {
      key: 2,
      loginId: { value: 'id2', error: 'error1' },
      password: { value: 'pw12' },
      name: { value: 'name2' },
      departmentName: { value: 'departmentName2' },
      departmentCode: { value: 'departmentCode2', error: 'error2' },
      employPosition: { value: 'employPosition2' },
      employJob: { value: 'employJob2' },
      employType: { value: 'employType2' },
      companyPhoneNum: { value: 'companyPhoneNum2' },
      phoneNum: { value: 'phoneNume', error: 'error2' },
      birthday: { value: 'birthday2' },
    },
  ]);
  const [buttonLoading, setButtonLoading] = useState(false);

  const onInputChange = (e, key, index) => {
    const newData = [...data];
    newData[index][key].value = e.target.value;
    console.log(newData);
    setData(newData);
  };

  const columns = [
    {
      title: '아이디',
      dataIndex: 'loginId',
      key: 'loginId',
      render(text, record, index) {
        return {
          children: record.loginId.error ? (
            <Input
              value={record.password.value}
              onChange={e => onInputChange(e, 'loginId', index)}
            />
          ) : (
            <div>{record.loginId.value}</div>
          ),
        };
      },
    },
    {
      title: '비밀번호',
      dataIndex: 'password',
      key: 'password',
      render(text, record, index) {
        return {
          children: record.password.error ? (
            <Input
              value={record.password.value}
              onChange={e => onInputChange(e, 'password', index)}
            />
          ) : (
            <div>{record.password.value}</div>
          ),
        };
      },
    },
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      render(text, record, index) {
        return {
          children: record.name.error ? (
            <Input
              value={record.password.value}
              onChange={e => onInputChange(e, 'name', index)}
            />
          ) : (
            <div>{record.name.value}</div>
          ),
        };
      },
    },
    {
      title: '조직',
      dataIndex: 'departmentName',
      key: 'departmentName',
      render(text, record, index) {
        return {
          children: record.departmentName.error ? (
            <Input
              value={record.password.value}
              onChange={e => onInputChange(e, 'departmentName', index)}
            />
          ) : (
            <div>{record.departmentName.value}</div>
          ),
        };
      },
    },
    {
      title: '조직 코드',
      dataIndex: 'departmentCode',
      key: 'departmentCode',
      render(text, record, index) {
        return {
          children: record.departmentCode.error ? (
            <Input
              value={record.password.value}
              onChange={e => onInputChange(e, 'departmentCode', index)}
            />
          ) : (
            <div>{record.departmentCode.value}</div>
          ),
        };
      },
    },
    {
      title: '직책',
      dataIndex: 'employPosition',
      key: 'employPostion',
      render(text, record, index) {
        return {
          children: record.employPosition.error ? (
            <Input
              value={record.password.value}
              onChange={e => onInputChange(e, 'employPosition', index)}
            />
          ) : (
            <div>{record.employPosition.value}</div>
          ),
        };
      },
    },
    {
      title: '직위',
      dataIndex: 'employJob',
      key: 'employJob',
      render(text, record, index) {
        return {
          children: record.employJob.error ? (
            <Input
              value={record.password.value}
              onChange={e => onInputChange(e, 'employJob', index)}
            />
          ) : (
            <div>{record.employJob.value}</div>
          ),
        };
      },
    },
    {
      title: '고용형태',
      dataIndex: 'employType',
      key: 'employType',
      render(text, record, index) {
        return {
          children: record.employType.error ? (
            <Input
              value={record.password.value}
              onChange={e => onInputChange(e, 'employType', index)}
            />
          ) : (
            <div>{record.employType.value}</div>
          ),
        };
      },
    },
    {
      title: '회사 전화',
      dataIndex: 'companyPhoneNum',
      key: 'companyPhoneNum',
      render(text, record, index) {
        return {
          children: record.companyPhoneNum.error ? (
            <Input
              value={record.password.value}
              onChange={e => onInputChange(e, 'companyPhoneNum', index)}
            />
          ) : (
            <div>{record.companyPhoneNum.value}</div>
          ),
        };
      },
    },
    {
      title: '휴대폰 번호',
      dataIndex: 'phoneNum',
      key: 'phoneNum',
      render(text, record, index) {
        return {
          children: record.birthday.error ? (
            <Input
              value={record.password.value}
              onChange={e => onInputChange(e, 'birthday', index)}
            />
          ) : (
            <div>{record.birthday.value}</div>
          ),
        };
      },
    },
    {
      title: '생년월일',
      dataIndex: 'birthday',
      key: 'birthday',
      render(text, record, index) {
        return {
          children: record.birthday.error ? (
            <Input
              value={record.password.value}
              onChange={e => onInputChange(e, 'birthday', index)}
            />
          ) : (
            <div>{record.birthday.value}</div>
          ),
        };
      },
    },
  ];

  const handleImportOrgUsers = async () => {
    console.log(data);
  };

  useEffect(() => {
    if (visible) {
    }
  }, [visible]);

  return (
    <MemberAddManyTableModal
      zIndex={1100}
      title={title}
      visible={visible}
      onOk={handleImportOrgUsers}
      onCancel={onCancel}
      okButtonProps={{
        loading: buttonLoading,
      }}
      okText="구성원 일괄 등록하기"
      cancelText="취소"
      width="63.375rem"
      height="40rem"
      centered
    >
      <MemberAddManyTableDivStyle className="title">
        구성원들을 한 번에 추가 및 수정할 수 있습니다.
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          locale={{ emptyText: <span>로딩 중...</span> }}
          scroll={{ y: '21.06rem' }}
        />
        <p>Tip</p>
        <ul>
          {/* <li>
            미리보기 화면에서 등록할 구성원 정보를 확인하시고 수정하실 수
            있습니다.
          </li> */}
          <li>미리보기 화면에서 등록할 구성원 정보를 확인하실 수 있습니다.</li>
          <li>
            업데이트 되어 바뀐 정보는{' '}
            <p style={{ display: 'inline-block', color: 'green' }}>초록색</p>
            으로 표기됩니다.
          </li>
          <li>
            통합 계정에 이미 가입된 아이디는{' '}
            <p style={{ display: 'inline-block', color: 'blue' }}>파란색</p>으로
            표기되며, 비밀번호가 통합계정과 동일하게 자동으로 가입됩니다.
          </li>
          {/* <li>
            경고 아이콘이 표시되는 잘못된 입력값이 있을 경우 구성원 일괄 등록을
            할 수 없습니다.
          </li> */}
        </ul>
      </MemberAddManyTableDivStyle>
    </MemberAddManyTableModal>
  );
};

const MemberAddManyTableModal = styled(Modal)``;

const MemberAddManyTableDivStyle = styled.div`
  .title {
    font-family: NotoSansCJKkr-Medium;
    font-size: 13px;
    color: #333333;
    letter-spacing: 0;
  }
`;
export default TestDialog;

