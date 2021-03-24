importOrgTableDialog


import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Form, Input, Button, useCoreStores } from 'teespace-core';
import { Table } from 'antd';

import XLSX from 'xlsx';
import { useObserver } from 'mobx-react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Column from 'antd/lib/table/Column';
import useStores from '../../hooks/UseStores';
import { SuccessModal } from '../common/CustomModal';

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  const mappingOrgTitle = {
    orgName: '조직 이름',
    departmentCode: '조직 부서 코드',
    parentDepartmentCode: '상위 조직 부서코드',
    orgLevel: '조직 레벨',
  };
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      console.log('values', values, ' ', dataIndex);
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
    console.log('save');
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ maxWidth: 150, margin: 0 }}
        name={dataIndex}
        colon={false}
        rules={[
          {
            required: true,
            whitespace: true,
            message: '조직 코드를 입력하세요',
          },
          () => ({
            async validator(rule, value) {
              console.log('value: ', value, rule);
              if (!value) {
                return Promise.reject(
                  new Error('유효하지 않은 조직 코드입니다.'),
                );
              }
            },
          }),
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div style={{ height: 22 }} onClick={toggleEdit}>
        {children}
      </div>
    );
  }

  return (
    <td style={{ border: '1px solid', width: '10px' }} {...restProps}>
      {childNode}
    </td>
  );
};
const ImportOrgTableDialog = ({ fileContent, error, handleUpload }) => {
  const [data, setData] = useState(fileContent);
  const handleSave = row => {
    const newData = [...data];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setData(newData);
    handleUpload(newData);
  };
  const columns = [
    {
      title: '조직',
      dataIndex: 'orgName',
      key: 'orgName',
      witdh: '25%',
      editable: true,
      render(text, record, index) {
        return {
          // props: {
          //   style: { background: !text ? 'red' : '' },
          // },
          children: text ? <span>{text}</span> : <span />,
          //     record.key === error.row ? (
          //       <Form.Item
          //         style={{ maxWidth: 150, margin: 0 }}
          //         name="orgName"
          //         colon={false}
          //         rules={[
          //           {
          //             required: true,
          //             whitespace: true,
          //             message: '조직 코드를 입력하세요',
          //           },
          //           () => ({
          //             async validator(rule, value) {
          //               console.log('value: ', value, rule);
          //               if (!value) {
          //                 return Promise.reject(
          //                   new Error('유효하지 않은 조직 코드입니다.'),
          //                 );
          //               }
          //             },
          //           }),
          //         ]}
          //         initialValue={text}
          //       >
          //         <Input />
          //       </Form.Item>
          //     ) : (
          //       text
          //     ),
        };
      },
    },
    {
      title: '조직 코드',
      dataIndex: 'departmentCode',
      key: 'departmentCode',
      witdh: '25%',
      editable: true,
      render(text, record, index) {
        return {
          // props: {
          //   style: { background: !text ? 'red' : '' },
          // }, text ? <span>{text}</span> : <span />,
          children:
            record.key === error[0].row ? (
              <Form.Item
                style={{ maxWidth: 150, margin: 0 }}
                name="departmentCode"
                colon={false}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: '조직 코드를 입력하세요',
                  },
                  () => ({
                    async validator(rule, value) {
                      console.log('value: ', value, rule);
                      if (!value) {
                        return Promise.reject(
                          new Error('유효하지 않은 조직 코드입니다.'),
                        );
                      }
                    },
                  }),
                ]}
                initialValue={text}
              >
                <Input />
              </Form.Item>
            ) : (
              text
            ),
        };
      },
    },
    {
      title: '상위 조직 코드',
      dataIndex: 'parentDepartmentCode',
      key: 'parentDepartmentCode',
      witdh: '25%',
      editable: true,
      render(text, record) {
        return {
          // props: {
          //   style: { background: !text ? 'red' : '' },
          // }, text ? <span>{text}</span> : <span />,
          children:
            record.key === error[0].row ? (
              <Form.Item
                style={{ maxWidth: 150, margin: 0 }}
                name="parentDepartmentCode"
                colon={false}
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: '조직 코드를 입력하세요',
                  },
                  () => ({
                    async validator(rule, value) {
                      console.log('value: ', value, rule);
                      if (!value) {
                        return Promise.reject(
                          new Error('유효하지 않은 조직 코드입니다.'),
                        );
                      }
                    },
                  }),
                ]}
                initialValue={text}
              >
                <Input />
              </Form.Item>
            ) : (
              text
            ),
        };
      },
    },
    {
      title: '조직 레벨',
      dataIndex: 'orgLevel',
      key: 'orgLevel',
      witdh: '25%',
    },
  ];
  const column = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: record => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  return (
    <ImportTable
      components={components}
      columns={column}
      rowClassName={(record, index) => {
        // 에러 있는 줄 색칠해서 보여주기
        console.log(error, ' ', index, ' ', record);
        if (index === 1) {
          return record.key === error[0].row ? 'wrong-row' : '';
        }
        if (index === 2) {
          return record.key === error[1].row ? 'wrong-row' : '';
        }
        return record.key === error[1].row ? 'wrong-row' : '';
      }}
      dataSource={data}
      pagination={false}
    />
  );
};
const ImportTable = styled(Table)`
  .wrong-row {
    background-color: #ffe6e3;

    &:hover {
      background-color: #ffe6e3 !important;
    }
  }
  /* overflow-y: scroll;
  width: 1000px;
  .editable-row {
  }
  .wrong-row {
    background-color: #ffe6e3;

    &:hover {
      background-color: #ffe6e3 !important;
    }
  }
  .wrong-row:hover {
    background-color: #ffe6e3;
  }
  &::-webkit-scrollbar {
    width: 4px;
    height: 4px;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
  .anticon-more {
    visibility: visible;
    margin: 0rem 0rem 0rem 6.25rem;
  }
  .anticon-more:hover {
    visibility: visible;
    background-color: red;
    margin: 0rem 0rem 0rem 6.25rem;
  }
  .ant-table {
    width: 90%;
  }

  .ant-input {
    width: 18.438rem;
    border-radius: 25px;
    margin: 0rem 11.2rem 0rem 14rem;
  }
  .ant-table.ant-table-bordered > .ant-table-container {
    border: 0;
    outline: 0;
  }
  .ant-table-content {
    border: 0;
    outline: 0;
  }
  .ant-table-thead .ant-table-cell {
    background-color: #ffffff;
    border-bottom: 1px solid black;
    display: flex;
  }
  .editable-cell {
    position: relative;
  }

  .editable-cell-value-wrap {
    padding: 5px 12px;
    cursor: pointer;
  }

  .editable-row:hover .editable-cell-value-wrap {
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }

  [data-theme='dark'] .editable-row:hover .editable-cell-value-wrap {
    border: 1px solid #434343;
  }
  thead th.ant-table-cell:nth-child(1) {
    text-align: center;
  }
  tbody td.ant-table-cell:nth-child(1) {
    text-align: center;
  }
  .ant-input:focus,
  .ant-input-focused {
    border-color: #6c56e5;
    --antd-wave-shadow-color: #6c56e5;
  }

  .ant-input:hover,
  .ant-input-hover {
    border-color: #6c56e5;
    --antd-wave-shadow-color: #6c56e5;
  }

  .ant-btn {
    border-radius: 4px;
    border: 1px solid #c6ced6;
    color: #3b3b3b;
  }

  .ant-btn:hover,
  .ant-btn:active {
    background: #bcbeff;
    color: #3b3b3b;
  }

  h4.ant-typography,
  .ant-typography h4 {
  }

  .ant-btn[disabled],
  .ant-btn[disabled]:hover,
  .ant-btn[disabled]:focus,
  .ant-btn[disabled]:active {
    background: #cccccc;
  }
  .ant-table.ant-table-bordered > .ant-table-footer {
    background-color: #ffffff;
    border: 0;
  } */
`;
const ImportDialogStyle = styled.div`
  height: 14rem;
  width: 90rem;
  overflow: scroll;
  display: flex;
`;
export default ImportOrgTableDialog;