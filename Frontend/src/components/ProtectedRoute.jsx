import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import tokenService from '../services/token'

const ProtectedRoute = ({ element }) => {
    const [isValid, setIsValid] = useState(null); // null: chưa kiểm tra, true/false: kết quả kiểm tra
  
    useEffect(() => {
      const checkToken = async () => {
        const valid = await tokenService.isTokenValid();
        setIsValid(valid); // Cập nhật trạng thái sau khi kiểm tra
      };
  
      checkToken();
    }, []); // Chỉ chạy một lần khi component mount
  
    // Hiển thị trạng thái "đang kiểm tra" (ví dụ: loader) khi chưa hoàn tất kiểm tra
    if (isValid === null) {
      return <div>Loading...</div>;
    }
  
    // Nếu token không hợp lệ, chuyển hướng đến trang login
    if (!isValid) {
      return <Navigate to="/login" />;
    }
  
    // Token hợp lệ, render nội dung bảo vệ
    return element || <Outlet />;
};

export default ProtectedRoute
