import { RouterProvider } from "react-router-dom";
import router from "./router";
function App() {
  return (
    <div className="App">
      {/* 路由引入 */}
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}

export default App;
