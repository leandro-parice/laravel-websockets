import React from "react";

interface Props {
    value: string | null;
    onClick: () => void;
}

const Square: React.FC<Props> = ({ value, onClick }) => {
    return (
        <button onClick={onClick}
            className="w-20 h-20 border border-gray-400 text-2xl font-bold flex items-center justify-center hover:bg-gray-600"
        >
            {value}
        </button>
    );
}

export default Square;