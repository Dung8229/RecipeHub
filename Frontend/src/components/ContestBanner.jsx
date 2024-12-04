import { useNavigate } from 'react-router-dom';

const ContestBanner = ({ backgroundImage, title, description, link }) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-4xl rounded-lg overflow-hidden shadow-lg justify-center">
      <img src={backgroundImage} alt="Contest Image" className="w-full h-auto" />
      <div className="absolute inset-0 bg-black bg-opacity-25 flex flex-col justify-end items-start p-8">
        <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
        <p className="text-lg text-white mb-4">{description}</p>
        <button
          className="bg-primary hover:bg-primaryHover text-white font-bold py-2 px-4 rounded-full"
          onClick={() => navigate(link)}
        >
          Join Now
        </button>
      </div>
    </div>
  );
};

export default ContestBanner;