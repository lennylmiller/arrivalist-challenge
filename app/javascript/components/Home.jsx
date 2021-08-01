import { Layout } from "antd";
import React from "react";
import Dashboard from "./Dashboard";
import Header from "./Header";

const { Content, Footer } = Layout;

export default () => (
    <Layout className="layout">
        <Header />
        <Content style={{ padding: "0 50px" }}>
            <div className="site-layout-content" style={{ margin: "100px auto" }}>
                <h1>Arrivalist Homework</h1>
                <Dashboard />
            </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Arrivalist ©2020.</Footer>
    </Layout>
);
