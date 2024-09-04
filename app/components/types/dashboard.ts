import type { IconName } from "./icon";
import type { NakedUser } from "./user";

export type NavSidebar = {
  name: string;
  href: string;
  icon: IconName;
};

export type NavHeader = {
  name: string;
  href: string;
};

export type DynamicSidebarProps = {
  navOverview: NavSidebar[];
  navManage: NavSidebar[];
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export type StaticSideBarProps = {
  navOverview: NavSidebar[];
  navManage: NavSidebar[];
};

export type HeaderProps = {
  userLoggedIn: NakedUser;
  navUser: NavHeader[];
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
