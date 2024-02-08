interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <div className="flex w-full min-h-[50px] justify-between items-center pl-4 pr-4 bg-blue-400 shadow-chatHeader rounded-t-lg">
      <div className="text-gray-800 text-l flex items-center justify-center gap-2 text-white">
        Live support
      </div>
    </div>
  );
};

export default Header;
