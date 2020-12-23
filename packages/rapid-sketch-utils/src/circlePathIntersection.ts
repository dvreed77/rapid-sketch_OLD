// import { TreeNode, TreeLeaf } from "./lineSegmentTree";

// export function circlePathIntersection(
//   node: TreeNode | TreeLeaf,
//   circle: ICircle
// ) {
//   const d = node.distance([circle.x, circle.y]);

//   if (d <= circle.r) {
//     return node instanceof TreeNode
//       ? node.children
//           .map((child) => circlePathIntersection(child, circle))
//           .some((d) => d)
//       : true;
//   } else {
//     return false;
//   }
// }
