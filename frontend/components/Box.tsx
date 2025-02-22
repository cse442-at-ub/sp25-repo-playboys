import React from 'react';
import styles from "./Box.module.css"; // Import CSS module

const Box: React.FC = () => {
    return <div className={styles.box}>Box Component</div>;
};

export default Box;