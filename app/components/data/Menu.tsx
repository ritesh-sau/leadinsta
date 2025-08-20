import { MenuItem } from "../sideBar/Node";


export const menu: MenuItem[] = [
  {
    name: "Masters",
    children: [
      {
        name: "Product",
        children: [
          {
            name: "Add Product",
            route: "/dashboard/masters/product/addproduct",
          },
          {
            name: "Approved Product",
            route: "/dashboard/masters/product/approvedproduct",
          },
          {
            name: "Pending Product",
            route: "/dashboard/masters/product/pendingproduct",
          },
          {
            name: "Rejected Product",
            route: "/dashboard/masters/product/rejectedproduct",
          },
        ],
      },
    ],
  },
];