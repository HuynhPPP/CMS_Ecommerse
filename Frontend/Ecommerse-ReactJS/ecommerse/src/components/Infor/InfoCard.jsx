import styles from './styles.module.scss';

function InfoCard({ content, descreption, src }) {
    const { containerCard, containerContent, title, des } = styles;
    return <div className={containerCard}>
        <img width={40} height={41} src={src} alt="truckIcon" />

        <div className={containerContent}>
            <div className={title}>{content}</div>
            <div className={des}>{descreption}</div>
        </div>
    </div>;
}

export default InfoCard;