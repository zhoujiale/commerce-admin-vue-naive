/**
 * Namespace Api
 *
 * All backend api type
 */
declare namespace Api {
  namespace Common {
    /** common params of paginating */
    interface PaginatingCommonParams {
      /** current page number */
      current: number;
      /** page size */
      size: number;
      /** total count */
      total: number;
    }

    /** common params of paginating query list data */
    interface PaginatingQueryRecord<T = any> extends PaginatingCommonParams {
      records: T[];
    }

    /** common search params of table */
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    /**
     * enable status
     *
     * - "1": enabled
     * - "2": disabled
     */
    type EnableStatus = '1' | '2';

    /** common record */
    type CommonRecord<T = any> = {
      /** record id */
      id: number;
      /** record creator */
      createBy: string;
      /** record create time */
      createTime: string;
      /** record updater */
      updateBy: string;
      /** record update time */
      updateTime: string;
      /** record status */
      status: EnableStatus | null;
    } & T;

    type CommonOperation<T = any> = {
      data: number;
    } & T;
  }

  /**
   * namespace Auth
   *
   * backend api module: "auth"
   */
  namespace Auth {
    interface LoginToken {
      token: string;
      refreshToken: string;
    }

    interface UserInfo {
      id: string;
      username: string;
      roles: string[];
      permissions: string[];
      departmentId: string;
      departmentName: string;
      isAdmin: boolean;
    }

    interface UpdatePassword {
      password: string;
      confirmPassword: string;
    }
  }

  /**
   * namespace Route
   *
   * backend api module: "route"
   */
  namespace Route {
    type ElegantConstRoute = import('@elegant-router/types').ElegantConstRoute;

    interface MenuRoute extends ElegantConstRoute {
      id: string;
    }

    interface UserRoute {
      routes: MenuRoute[];
      home: import('@elegant-router/types').LastLevelRouteKey;
    }
  }

  /** 系统管理 */
  namespace SystemManage {
    type CommonSearchParams = Pick<Common.PaginatingCommonParams, 'current' | 'size'>;

    type Department = Common.CommonRecord<{
      id: number;
      departmentName: string;
      parentId: number;
      remark: string;
      children?: Array<Department>;
    }>;
    type DepartmentSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Department, 'id' | 'departmentName'> & CommonSearchParams
    >;

    type DepartmentPage = Common.PaginatingQueryRecord<Department>;

    type DepartmentList = Array<Department>;

    /**
     * - "1" : 目录
     * - "2": 菜单
     * - "3": 按钮
     */
    type MenuType = '1' | '2' | '3';

    /**
     * icon type
     *
     * - "1": iconify icon
     * - "2": local icon
     */
    type IconType = '1' | '2';

    type Menu = Common.CommonRecord<{
      id: number;
      menuName: string;
      menuKey: string;
      menuType: MenuType;
      parentId: number;
      icon: string;
      localIcon: string;
      component: string;
      in18nKey: string;
      route: string;
      sortNumber: number;
      permissions: string[];
      isHide: boolean;
      children: Array<Menu>;
    }>;

    type MenuSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Menu, 'id' | 'menuName'> & CommonSearchParams
    >;

    type MenuPage = Common.PaginatingQueryRecord<Menu>;

    type MenuList = Array<Menu>;

    type Role = Common.CommonRecord<{
      id: number;
      roleName: string;
      remark: string;
      menuIdList: Array<number>;
    }>;

    type RoleSearchParams = CommonType.RecordNullable<
      Pick<Api.SystemManage.Role, 'id' | 'roleName'> & CommonSearchParams
    >;

    type RolePage = Common.PaginatingQueryRecord<Role>;

    type RoleList = Array<Role>;

    type SystemUser = Common.CommonRecord<{
      id: number;
      username: string;
      realName: string;
      password: string;
      userStatus: UserStatus;
      contactInfo: string;
      roleId: string | any;
      roleName: string;
      departmentId: string;
      isAdmin: boolean;
      departmentName: string;
      expireDate: number;
      createDate: string;
    }>;

    type SystemUserSearchParams = CommonType.RecordNullable<
      Pick<
        Api.SystemManage.SystemUser,
        'id' | 'username' | 'realName' | 'userStatus' | 'roleId' | 'departmentId' | 'createDate'
      > &
        CommonSearchParams
    >;

    type SystemUserPage = Common.PaginatingQueryRecord<SystemUser>;

    /**
     * - "1": 正常
     * - "2": 禁用
     */
    type UserStatus = '1' | '2';
  }
}
