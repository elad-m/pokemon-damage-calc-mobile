import React from 'react';
import renderer from 'react-test-renderer';

import MainScreen from '../../screens/MainScreen';

describe('<MainScreen />', () => {
    test('has 2 childs', () => {
        const tree = renderer.create(<MainScreen/>).toJSON();
        expect(tree.children.length).toBe(2);
  });
});