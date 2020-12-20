import React from 'react';
import renderer from 'react-test-renderer';

import NumberTextInput from '../../components/NumberTextInput';

const defaultProps = {
    minValue: 0,
    maxValue: 252, 
    entryKey:'hp', 
    statEntries:  {hp: 100, atk: 152, def: 0, spa: 0, spd: 0, spe: 252}, 
    setStatEntries: (statEntries) => {} // should I mock this function? 
};

describe('<NumberTextInput />', () => {
    test('has 1 child', () => {
        const tree = renderer.create(<NumberTextInput {...defaultProps}/>).toJSON();
        expect(tree.children.length).toBe(1);
    });

});