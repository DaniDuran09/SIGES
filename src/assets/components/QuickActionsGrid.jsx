import React from 'react';
import styles from './QuickActionsGrid.module.css';

const QuickActionsGrid = ({ title = "Acciones rápidas", actions = [] }) => {
    return (
        <div className={styles.quickActionsContainer}>
            <h3>{title}</h3>
            <div className={styles.quickActionsGrid}>
                {actions.map((action, index) => (
                    <button
                        key={index}
                        className={styles.quickActionButton}
                        style={{ backgroundColor: action.color || '#eee' }}
                        onClick={action.onClick}
                    >
                        <div className={styles.iconWrapper}>
                            {action.icon}
                        </div>
                        <div className={styles.textWrapper}>
                            <h2 className={styles.actionTitle}>{action.title}</h2>
                            <h2 className={styles.actionSubtitle}>{action.subtitle}</h2>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActionsGrid;
