import React, { useState } from 'react';
import { CheckboxField } from '../../../react-plugins-deps/components/FormComponents/Checkbox/Checkbox';
import { Humanize } from '../../../react-plugins-deps/components/helpers/Humanization';
import { Divider } from 'antd';
import { css } from 'emotion';

const TOP_LIMIT = 5;

const Styling = {
  label: css`
    display: grid;
    grid-template-areas: 'filtername percentagearea';
    grid-template-rows: 30px;
    grid-template-columns: 150px auto;
    grid-gap: 10px;
    height: auto;
    margin: 0;
  `,
  filterName: css`
    grid-area: filtername;
  `,
  percentage: css`
    grid-area: percentagearea;
    display: flex;
    justify-content: flex-end;
  `,
  filterHeaderWrapper: css`
    display: flex;
    justify-items: space-between;
    margin-bottom: 0 !important;
    margin-top: 20px !important;
  `,
  filterHeader: css`
    margin-right: auto;
  `,
  divider: css`
    margin-top: 0 !important;
    margin-bottom: 5px !important;
  `,
  showModeSwitcher: css`
    cursor: pointer;
  `,
};

export const CheckboxGroup = ({ form, name, items, group, showAll, filter, labels }) => {
  const [showTop, setShowTop] = useState(false);
  const filteredData = items
    .filter(item => item.value)
    .filter(item => {
      if (!showAll) {
        return item.checked;
      }
      return true;
    });

  const itemsList = (showTop ? filteredData.slice(0, TOP_LIMIT) : filteredData)
    .filter(item => item.value.toLowerCase().includes(filter.toLowerCase()))
    .map(item => {
      // If there is no value - disable checkbox and hide percent
      const isValue = item.hasOwnProperty('main_metric_percent');
      return (
        <div className={Styling.label} key={`${group}:${item.value}`}>
          <span className={Styling.filterName}>
            <CheckboxField
              form={form}
              name={`${group}:${item.value}`}
              label={item.value}
              checked={labels && labels[group] && labels[group].includes(item.value)}
              disabled={!isValue}
            />
          </span>
          {isValue ? (
            <span className={Styling.percentage}>
              <span>{Humanize.transform(item.main_metric_percent, 'percent')}</span>
            </span>
          ) : null}
        </div>
      );
    });
  return itemsList.length ? (
    <div>
      <p className={Styling.filterHeaderWrapper}>
        <span className={Styling.filterHeader}>{name}</span>
        {filteredData.length > TOP_LIMIT ? (
          <span
            onClick={() => {
              setShowTop(!showTop);
            }}
            className={Styling.showModeSwitcher}
          >
            {showTop ? `Show all (${filteredData.length})` : `Show top ${TOP_LIMIT}`}
          </span>
        ) : (
          <span></span>
        )}
      </p>
      <Divider className={Styling.divider}></Divider>
      {itemsList}
    </div>
  ) : null;
};
