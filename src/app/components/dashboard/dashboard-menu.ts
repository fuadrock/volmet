import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'grid-outline',
    link: '/dashboard/home'
  },
  {
    title: 'Users Management',
    icon: 'people-outline',
    children: [
      {
        title: 'Users',
        link: '/dashboard/user',
      },
      {
        title: 'Groups',
        link: '/dashboard/group',
      },
      {
        title: 'Roles',
        link: '/dashboard/role',
      },
      {
        title: 'Access Controls',
        link: '/dashboard/access-control',
      },

    ],
  },
  {
    title: 'Configurations & Settings',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'Configurations',
        link: '/dashboard/configurations',
      },
      {
        title: 'Holiday Calendar',
        link: '/dashboard/holiday-calendar',
      }
    ]
  },
  {
    title: 'Logs & Reports',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'Log Settings',
        link: '/dashboard/event-logging',
      },
      {
        title: 'Event Logs',
        link: '/dashboard/event-logging/event-list',
      }
    ]
  }
];


// menuItems(data) {
//   let MENU_ITEMS: NbMenuItem[]=[];
//   MENU_ITEMS.push(
//     {
//       title: 'Dashboard',
//       icon: 'grid-outline',
//       link: '/dashboard/home'
//     }
//   );

//  let usemanagement=[];
//   var readUser = data.filter(element => element.Name === 'VIEW_USER');
//   var viewData = readUser[0];
//   if(viewData.RolePermission.Permission!='NONE'){
//     usemanagement.push({
//       title: 'Users',
//       link: '/dashboard/user',
//     });
//   }

//   var readGroup = data.filter(element => element.Name === 'VIEW_GROUP');
//   var viewGroup = readGroup[0];
//   if(viewGroup.RolePermission.Permission!='NONE'){
//     usemanagement.push({
//       title: 'Groups',
//       link: '/dashboard/group',
//     });
//   }

//   var readRole = data.filter(element => element.Name === 'VIEW_ROLE');
//   var viewRole = readRole[0];
//   if(viewRole.RolePermission.Permission!='NONE'){
//     usemanagement.push(   {
//       title: 'Roles',
//       link: '/dashboard/role',
//     });
//   }

//   var readControl = data.filter(element => element.Name === 'VIEW_ACCESS_CONTROL');
//   var viewControl = readControl[0];
//   if(viewControl.RolePermission.Permission!='NONE'){
//     usemanagement.push({
//         title: 'Access Controls',
//         link: '/dashboard/access-control',
//     });
//   }

//   if(usemanagement.length>0){
//   let userMenu = {
//   title: 'Users Management',
//   icon: 'people-outline',
//   Children : usemanagement
//   }
//   MENU_ITEMS.push(userMenu);
// }
// this.menu = MENU_ITEMS;
// //this.nbMenuService.addItems(MENU_ITEMS);
// console.log("calculated menu:",MENU_ITEMS );
// }
