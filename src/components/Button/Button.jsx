import { LoadMore } from './Button.styled';

const Button = ({ clickHandle }) => {
  return (
    <LoadMore type="button" onClick={clickHandle}>
      load more
    </LoadMore>
  );
};

export default Button;
