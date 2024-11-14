"use client";
import React from 'react';
import Link from 'next/link';
import { Layout, Menu, theme } from 'antd';
import {
  FormOutlined,
  LineChartOutlined,
  FunctionOutlined,
  FolderOpenOutlined,
  FileZipOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;

export default function AntLayout({ children, collapsed, setCollapsed }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={(broken) => {
          console.log(broken);
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type);
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: React.createElement(FolderOpenOutlined),
              label: 'TIỆN ÍCH TÀI LIỆU',
              children: [
                {
                  key: '1-1',
                  icon: React.createElement(FileZipOutlined),
                  label: (
                    <Link href="/nen-file-pdf">
                      NÉN FILE PDF
                    </Link>
                  ),
                },
              ],
            },
            {
              key: '2',
              icon: React.createElement(LineChartOutlined),
              label: 'TOOL MARKETING',
              children: [
                {
                  key: '2-1',
                  icon: React.createElement(FormOutlined),
                  label: (
                    <Link href="/tinh-mat-do-tu-khoa">
                      MẬT ĐỘ & ĐỀ XUẤT TỪ KHÓA
                    </Link>
                  ),
                },
                {
                  key: '2-2',
                  icon: React.createElement(FunctionOutlined),
                  label: (
                    <Link href="/tinh-kei-tu-khoa">
                      TÍNH CHỈ SỐ KEI
                    </Link>
                  ),
                },
              ],
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content
          style={{
            margin: '24px 16px 0',
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
}
