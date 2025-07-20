import { useNavigate } from "react-router-dom";
import { NavBar } from "antd-mobile";
import PropTypes from "prop-types";
import "./index.scss";

const NavHeader = ({ children, onBack }) => {
  const navigate = useNavigate();
  const defaultHandler = () => {
    navigate(-1);
  };
  return (
    <NavBar className="navbar" onBack={onBack || defaultHandler}>
      {children}
    </NavBar>
  );
};

NavHeader.propTypes = {
  children: PropTypes.string.isRequired,
  onBack: PropTypes.func,
};

export default NavHeader;
