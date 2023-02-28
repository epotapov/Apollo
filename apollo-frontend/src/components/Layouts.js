import React, { Component, PropTypes } from 'react';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import HeaderDiv from './HeaderDiv';
import { Layout, Menu, Icon } from 'antd';
const { SubMenu }  = Menu;
const { Header,Sider, Content } = Layout;

class Layouts extends React.Component {
  state = {
    collapsed: true,
  };
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  rootSubmenuKeys = ['sub1', 'sub2', 'sub4','sub5','sub3', 'sub6'];

  state = {
    openKeys: '',
    collapsed: true,
  };

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      });
    }
  };
  render() {
    const active = this.props.active;
    // const classname = (this.props, "classname", " ");
    return (
        <Layout className={`${ this.props.classname }`} >
          <Sider trigger={null} collapsible collapsed={this.state.collapsed}  style={{ background: '#fff' }} className="sidebar-left"  onCollapse={this.onCollapse}>
          <div className="logo" />
              <Menu theme="light" mode="inline" defaultSelectedKeys={[active]}
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}  mode="vertical">
                <Menu.Item key="1">
                    <Link to="/dashboard">
                      <div class>
                        <Icon type="dashboard" />
                        <span> Dashboard </span>
                      </div>
                    </Link>
                </Menu.Item>
                <SubMenu key="2"
                    title={
                      <span>
                          <Icon type="layout" />
                          <span>Layout</span>
                      </span>
                    }
                    >
                    <Menu.Item key="sub2.1">
                        <Link to="/layout/grid"><span>Grid</span></Link>
                    </Menu.Item>
                    <Menu.Item key="sub2.2">
                        <Link to="/layout/gridLayout"><span>Layout</span></Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu key="3"
                    title={
                    <span>
                        <Icon type="form" />
                        <span>Form</span>
                    </span>
                    }
                    >
                    <Menu.Item key="3.1">
                        <Link to="/form/form-elements">Form Elements</Link>
                    </Menu.Item>
                    <Menu.Item key="3.2">
                        <Link to="/form/form-components">Form Components</Link>
                    </Menu.Item>
                    <Menu.Item key="3.3">
                        <Link to="/form/form-controls">Form Controls</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu
                    key="4"
                    title={
                    <span>
                        <Icon type="menu" />
                        <span>Navigation</span>
                    </span>
                    }
                    >
                    <Menu.Item key="4.1">
                        <Link to="/navigation/affix">Affix / Breadcrumbs</Link>
                    </Menu.Item>
                    <Menu.Item key="4.2">
                        <Link to="/navigation/dropdown">Dropdown</Link>
                    </Menu.Item>
                    <Menu.Item key="4.4">
                        <Link to="/navigation/menu">Menu</Link>
                    </Menu.Item>
                    <Menu.Item key="4.5">
                        <Link to="/navigation/pagination">Pagination</Link>
                    </Menu.Item>
                    <Menu.Item key="4.6">
                        <Link to="/navigation/pageheader">Pageheader</Link>
                    </Menu.Item>
                    <Menu.Item key="4.7">
                        <Link to="/navigation/steps">Steps</Link>
                    </Menu.Item>
                </SubMenu>
                <SubMenu
                key="5"
                    title={
                    <span>
                        <Icon type="appstore" />
                        <span>Components</span>
                    </span>
                    }
                    >
                    <Menu.Item key="5.1">
                        <Link to="/components/buttons">
                        Buttons</Link>
                    </Menu.Item>
                    <Menu.Item key="5.2">
                        <Link to="/components/typography">
                        Typography</Link>
                    </Menu.Item>
                </SubMenu>
                {/* 
                <Menu.Item key="5">
                    <Link to="calendar">
                    
                      <Icon type="calendar" />
                      Calendar
                    
                    </Link>
                </Menu.Item>
                */}
                <SubMenu
                      key="6"
                      title={
                      <span>
                          <Icon type="calendar" />
                          <span>Calendar</span>
                      </span>
                      }
                      >
                      <Menu.Item key="6.1">
                          <Link to="/calendar/basic-calendar">Basic Calendar</Link>
                      </Menu.Item>
                      <Menu.Item key="6.2">
                          <Link to="/calendar/notice-calendar">Notice Calendar</Link>
                      </Menu.Item>
                      <Menu.Item key="6.3">
                          <Link to="/calendar/selectable-calendar">Selectable Calendar</Link>
                      </Menu.Item>
                </SubMenu>
                <SubMenu
                      key="7"
                      title={
                      <span>
                          <Icon type="table" />
                          <span>Datadisplay </span>
                      </span>
                      }
                      >
                      <Menu.Item key="7.1">
                          <Link to="/data-display/list">
                          List </Link>
                      </Menu.Item>
                      <Menu.Item key="7.2">
                          <Link to="/data-display/tooltip-popover">
                          Tooltips/Popovers  </Link>
                      </Menu.Item>
                      <Menu.Item key="7.3">
                          <Link to="/data-display/carousel">
                          Carousel</Link>
                      </Menu.Item>
                </SubMenu>
                <Menu.Item key="8">
                    <Link to="/charts">
                        <div><Icon type="line-chart" /><span>Charts</span></div>
                    </Link>
                </Menu.Item>
                <Menu.Item key="9">
                     <Link to="/profile">
                        <div><Icon type="profile" /><span>Profile</span></div>
                    </Link>
                </Menu.Item>
                <Menu.Item key="10">
                    <Link to="/table">
                         <div><Icon type="table" /><span>Table</span></div>
                     </Link>
                </Menu.Item>
                <Menu.Item key="11">
                    <Link to="/language-switcher">
                          <div><Icon type="switcher" /><span>Language Switcher</span></div>
                    </Link>
                </Menu.Item>
                <Menu.Item key="12">
               
                    <Link to="/docs">
                          <div><Icon type="file-text" /><span>docs </span></div>
                    </Link>
                </Menu.Item>
              </Menu>
              <Icon
              className="trigger"
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
              />    
              </Sider>
              <Layout>
                <Header className="headerTop">
                    <HeaderDiv />
                    {/* <Icon
                className="trigger layout-trigger header-toggle"
                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={this.toggle}
                />  */}
                </Header>
                <Content
                style={{
                padding: 24,
                minHeight: '100vh',
                }}
                className={this.state.collapsed ? "collapsed mainContnet " : "mainContnet"}
                >
               
                {this.props.children}
                </Content>
              </Layout>
        </Layout>

   
  );
  }
}
export default Layouts;