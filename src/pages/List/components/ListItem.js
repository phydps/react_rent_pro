import styles from "./listItem.module.scss";
import { useNavigate } from "react-router-dom";
import { REQUEST_URL } from "@/components/CONST";

const HouseListItem = ({ key, item, style }) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.houseItem}
      style={style}
      onClick={() => navigate(`/detail/${item.houseCode}`)}
    >
      <div className="imgWrap">
        <img className="img" src={`${REQUEST_URL}${item.houseImg}`} alt="" />
      </div>
      <div className="content">
        <h3 className="title">{item.title}</h3>
        <div className="desc">{item.desc}</div>
        <div>
          {item.tags.map((item, index) => {
            const num = (index % 3) + 1;
            const name = `tag tag${num}`;
            return (
              <span className={name} key={`${item}_${key}`}>
                {item}
              </span>
            );
          })}
        </div>
        <div className="price">
          <span className="priceNum">{item.price}</span> 元/月
        </div>
      </div>
    </div>
  );
};

export default HouseListItem;
