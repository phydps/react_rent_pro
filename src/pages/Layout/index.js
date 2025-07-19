import { TabBar, NavBar } from "antd-mobile";
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppOutline,
  ContentOutline,
  UserOutline,
  SearchOutline,
} from "antd-mobile-icons";
import "./index.scss";

// TabBar 数据
const tabItems = [
  {
    title: "首页",
    icon: <AppOutline />,
    path: "/",
  },
  {
    title: "找房",
    icon: <SearchOutline />,
    path: "/list",
  },
  {
    title: "资讯",
    icon: <ContentOutline />,
    path: "/news",
  },
  {
    title: "我的",
    icon: <UserOutline />,
    path: "/profile",
  },
];

const RentLayout = () => {
  const navigate = useNavigate();
  // 根据当前路由路径选中底部tabbar
  const location = useLocation();
  const selectedBar = location.pathname;

  const chooseTabBar = (val) => {
    console.log(val);
    // setSelectedBar(val.path);
    navigate(val);
  };

  return (
    <div className="rentLayout">
      {/* <div className="top">
        <NavBar>配合路由使用</NavBar>
      </div> */}
      <div className="homeContent">
        <Outlet />
      </div>
      <div className="bottom">
        {/* 底部菜单 */}
        <TabBar activeKey={selectedBar} onChange={chooseTabBar}>
          {tabItems.map((item) => {
            return (
              <TabBar.Item
                title={item.title}
                key={item.path}
                icon={item.icon}
              ></TabBar.Item>
            );
          })}
        </TabBar>
      </div>
    </div>
  );
};

export default RentLayout;
