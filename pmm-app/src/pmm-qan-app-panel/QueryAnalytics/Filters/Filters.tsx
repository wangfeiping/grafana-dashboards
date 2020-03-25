import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { Button } from 'antd';
import { StateContext } from '../StateContext';
import FiltersService from './Filters.service';
import { useForm } from 'react-final-form-hooks';
import { Form as FormFinal } from 'react-final-form';
import Search from 'antd/lib/input/Search';
import { CheckboxGroup } from './CheckboxGroup';
import useWindowSize from 'react-plugins-deps/components/helpers/WindowSize.hooks';
import ScrollArea from 'react-scrollbar';
import { css } from 'emotion';

export const FILTERS_GROUPS = [
  {
    name: 'Environment',
    dataKey: 'environment',
  },
  {
    name: 'Cluster',
    dataKey: 'cluster',
  },
  {
    name: 'Replication Set',
    dataKey: 'replication_set',
  },
  {
    name: 'Database',
    dataKey: 'database',
  },
  {
    name: 'Schema',
    dataKey: 'schema',
  },
  {
    name: 'Node Name',
    dataKey: 'node_name',
  },
  {
    name: 'Service Name',
    dataKey: 'service_name',
  },
  {
    name: 'Client Host',
    dataKey: 'client_host',
  },
  {
    name: 'User Name',
    dataKey: 'username',
  },
  {
    name: 'Service Type',
    dataKey: 'service_type',
  },
  {
    name: 'Node Type',
    dataKey: 'node_type',
  },
  {
    name: 'City',
    dataKey: 'city',
  },
  {
    name: 'Availability Zone',
    dataKey: 'az',
  },
];

const Styling = {
  filtersWrapper: css`
    border: 1px solid rgb(40, 40, 40);
    padding: 5px 16px !important;
    overflow-y: scroll;
  `,
  filtersHeader: css`
    display: flex;
    align-items: flex-end;
    padding: 5px 0px !important;
    height: 50px !important;
  `,
  showAllButton: css`
    padding: 0 !important;
    height: auto;
  `,
  title: css`
    margin: 3px;
    margin-right: 15px;
  `,
  resetButton: css`
    padding: 0 !important;
    height: auto;
    margin-left: auto !important;
  `,
};

interface GroupInterface {
  dataKey: string;
  name: string;
}

const FILTERS_BODY_HEIGHT = 600;
export const Filters = ({ dispatch, groups, form, labels, filters }) => {
  // @ts-ignore
  const [width, height] = useWindowSize();
  const [filtersBodyHeight, setFiltersBodyHeight] = useState(FILTERS_BODY_HEIGHT);
  const [filter, setFilter] = useState('');
  const [showAll, showSetAll] = useState(true);

  // TODO: replace with something more elegant & fast
  useEffect(() => {
    const FILTERS_HEADER_SIZE = 50;
    const FILTERS_MARGIN_BOTTOM = 20;
    const filtersWrapperElement = document.querySelector('#query-analytics-filters');
    const filtersHeight = filtersWrapperElement
      ? height - filtersWrapperElement.getBoundingClientRect().y - FILTERS_HEADER_SIZE - FILTERS_MARGIN_BOTTOM
      : FILTERS_BODY_HEIGHT;
    setFiltersBodyHeight(filtersHeight);
  }, [height]);

  return (
    <div>
      <div className={Styling.filtersHeader}>
        <h5 className={Styling.title}>Filters</h5>
        <Button type="link" className={Styling.showAllButton} onClick={showSetAll.bind(null, !showAll)}>
          {showAll ? 'Show Selected' : 'Show All'}
        </Button>
        <Button
          type="link"
          className={Styling.resetButton}
          id="reset-all-filters"
          onClick={() => {
            setFilter('');
            dispatch({ type: 'RESET_LABELS' });
            form.reset();
          }}
        >
          Reset All
        </Button>
      </div>
      <ScrollArea className={Styling.filtersWrapper} style={{ height: filtersBodyHeight + 'px' }}>
        <Search
          placeholder="Filters search..."
          onChange={e => {
            setFilter(e.target.value);
            e.stopPropagation();
          }}
          style={{ width: '100%' }}
        />
        {groups
          .filter(group => filters[group.dataKey])
          .map(group => {
            const { name, dataKey } = group;
            return (
              <CheckboxGroup
                key={name}
                {...{
                  form,
                  name,
                  items: filters[dataKey].name,
                  group: dataKey,
                  showAll,
                  filter,
                  labels,
                }}
              />
            );
          })}
      </ScrollArea>
    </div>
  );
};

const FiltersContainer = () => {
  const [filters, setFilters] = useState({});
  const [groups, setGroups] = useState<GroupInterface[]>([]);
  const {
    dispatch,
    state: { labels = {}, from, to },
  } = useContext(StateContext);

  useEffect(() => {
    (async () => {
      try {
        const result = await FiltersService.getQueryOverviewFiltersList(labels, from, to);
        setFilters(result);
        setGroups(FILTERS_GROUPS);
      } catch (e) {
        //TODO: add error handling
      }
    })();
  }, [labels, from, to]);

  return (
    <FormFinal
      onSubmit={() => {}}
      render={(): ReactElement => {
        const { form, handleSubmit } = useForm({
          onSubmit: () => {},
          validate: () => undefined,
          initialValues: {},
        });
        // @ts-ignore
        return (
          <form
            onSubmit={handleSubmit}
            className="add-instance-form app-theme-dark"
            onChange={e => {
              dispatch({
                type: 'SET_LABELS',
                payload: { labels: form.getState().values },
              });
            }}
          >
            <Filters dispatch={dispatch} form={form} groups={groups} labels={labels} filters={filters} />
          </form>
        );
      }}
    />
  );
};

export default FiltersContainer;
