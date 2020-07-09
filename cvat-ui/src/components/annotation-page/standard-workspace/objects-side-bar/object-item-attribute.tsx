// Copyright (C) 2020 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Col } from 'antd/lib/grid';
import Select from 'antd/lib/select';
import Radio, { RadioChangeEvent } from 'antd/lib/radio';
import Checkbox, { CheckboxChangeEvent } from 'antd/lib/checkbox';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Text from 'antd/lib/typography/Text';

import consts from 'consts';
import { clamp } from 'utils/math';

interface Props {
    attrInputType: string;
    attrValues: string[];
    attrValue: string;
    attrName: string;
    attrID: number;
    changeAttribute(attrID: number, value: string): void;
}

function attrIsTheSame(
    prevProps: Props,
    nextProps: Props,
): boolean {
    return nextProps.attrID === prevProps.attrID
        && nextProps.attrValue === prevProps.attrValue
        && nextProps.attrName === prevProps.attrName
        && nextProps.attrInputType === prevProps.attrInputType
        && nextProps.attrValues
            .map((value: string, id: number): boolean => prevProps.attrValues[id] === value)
            .every((value: boolean): boolean => value);
}

function ItemAttributeComponent(props: Props): JSX.Element {
    const {
        attrInputType,
        attrValues,
        attrValue,
        attrName,
        attrID,
        changeAttribute,
    } = props;

    if (attrInputType === 'checkbox') {
        return (
            <Col span={24}>
                <Checkbox
                    className='cvat-object-item-checkbox-attribute'
                    checked={attrValue === 'true'}
                    onChange={(event: CheckboxChangeEvent): void => {
                        const value = event.target.checked ? 'true' : 'false';
                        changeAttribute(attrID, value);
                    }}
                >
                    <Text strong className='cvat-text'>
                        {attrName}
                    </Text>
                </Checkbox>
            </Col>
        );
    }

    if (attrInputType === 'radio') {
        return (
            <Col span={24}>
                <fieldset className='cvat-object-item-radio-attribute'>
                    <legend>
                        <Text strong className='cvat-text'>{attrName}</Text>
                    </legend>
                    <Radio.Group
                        size='small'
                        value={attrValue}
                        onChange={(event: RadioChangeEvent): void => {
                            changeAttribute(attrID, event.target.value);
                        }}
                    >
                        { attrValues.map((value: string): JSX.Element => (
                            <Radio key={value} value={value}>
                                {value === consts.UNDEFINED_ATTRIBUTE_VALUE
                                    ? consts.NO_BREAK_SPACE : value}
                            </Radio>
                        )) }
                    </Radio.Group>
                </fieldset>
            </Col>
        );
    }

    if (attrInputType === 'select') {
        return (
            <>
                <Col span={24}>
                    <Text strong className='cvat-text'>
                        {attrName}
                    </Text>
                </Col>
                <Col span={24}>
                    <Select
                        size='small'
                        onChange={(value: string): void => {
                            changeAttribute(attrID, value);
                        }}
                        value={attrValue}
                        className='cvat-object-item-select-attribute'
                    >
                        { attrValues.map((value: string): JSX.Element => (
                            <Select.Option key={value} value={value}>
                                {value === consts.UNDEFINED_ATTRIBUTE_VALUE
                                    ? consts.NO_BREAK_SPACE : value}
                            </Select.Option>
                        )) }
                    </Select>
                </Col>
            </>
        );
    }

    if (attrInputType === 'number') {
        const [min, max, step] = attrValues.map((value: string): number => +value);

        return (
            <>
                <Col span={24}>
                    <Text strong className='cvat-text'>
                        {attrName}
                    </Text>
                </Col>
                <Col span={24}>
                    <InputNumber
                        size='small'
                        onChange={(value: number | undefined): void => {
                            if (typeof (value) === 'number') {
                                changeAttribute(
                                    attrID, `${clamp(value, min, max)}`,
                                );
                            }
                        }}
                        value={+attrValue}
                        className='cvat-object-item-number-attribute'
                        min={min}
                        max={max}
                        step={step}
                    />
                </Col>
            </>
        );
    }

    return (
        <>
            <Col span={24}>
                <Text strong className='cvat-text'>
                    {attrName}
                </Text>
            </Col>
            <Col span={24}>
                <Input
                    size='small'
                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                        changeAttribute(attrID, event.target.value);
                    }}
                    defaultValue={attrValue}
                    className='cvat-object-item-text-attribute'
                />
            </Col>
        </>
    );
}

export default React.memo(ItemAttributeComponent, attrIsTheSame);