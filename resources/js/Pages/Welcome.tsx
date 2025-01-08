import React from 'react';
import { Link } from '@inertiajs/react';

const Welcome: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {/* Título */}
            <h1 className="text-4xl font-bold mb-8 text-center text-blue-500">
                Jogo da Velha
            </h1>

            {/* Tabuleiro decorativo */}
            <div className="grid grid-cols-3 gap-4 mb-12">
                {Array(9)
                    .fill(null)
                    .map((_, index) => (
                        <div
                            key={index}
                            className={`flex items-center justify-center w-20 h-20 border border-gray-700 text-4xl font-bold ${
                                index % 2 === 0 ? 'text-blue-500' : 'text-red-500'
                            }`}
                        >
                            {index % 2 === 0 ? 'X' : 'O'}
                        </div>
                    ))}
            </div>

            {/* Botões */}
            <div className="flex space-x-4">
                <Link
                    href="/login"
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
                >
                    Login
                </Link>
                <Link
                    href="/register"
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
                >
                    Cadastro
                </Link>
            </div>
        </div>
    );
};

export default Welcome;