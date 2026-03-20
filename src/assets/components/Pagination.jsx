import React from 'react';
import styles from './Pagination.module.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
        <div className={styles.paginationContainer}>
            <div className={styles.pageInfo}>
                Página <span>{currentPage + 1}</span> de <span>{totalPages}</span>
            </div>
            
            <div className={styles.buttons}>
                <button 
                    className={styles.pageButton} 
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    <FiChevronLeft size={20} />
                    Anterior
                </button>
                
                <button 
                    className={styles.pageButton} 
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                >
                    Siguiente
                    <FiChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
