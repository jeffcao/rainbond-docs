import clsx from 'clsx';
import React from 'react';
import styles from "./styles.module.css";
import Link from '@docusaurus/Link';

export function CardList(item): JSX.Element {
  const CardContentList = item.props.CardContentList;

  return (
    <div className={clsx('container',styles.container)}>
      <div className="row">
        {CardContentList.map(({ img, title, description, link }, index) => (
          <div className={clsx("col col--4", styles.col)} key={index}>
            <div className={clsx('card', styles.card)}>
              <div className={clsx('card__image', styles.card_img)}>
                <img className={styles.img} src={img} />
              </div>
              <div className="card__body">
                <h3>{title}</h3>
                <small style={{ color: '#637792' }}>{description}</small>
              </div>
              {/* <div className="card__footer">
                <Link to={link} className="button button--primary button--block">详情</Link>
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}