// components/BackButton.js
import { useLocation, useNavigate } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={goBack} className="back-button">
      ← Go Back
    </button>
  );
}