import React from 'react';
import colors from './colors'

export const themes = {

    light: {
        foreground: '#000000',
        background: '#eeeeee',
        header: colors.header,
        primary: colors.primary,
        secondary: colors.secondary,
        border:colors.border,
        clearButton: colors.clearButton,
        opaqueClearButton: colors.opaqueClearButton,
        pressable: colors.pressable,
        divider: colors.divider,
        statusBarStyle:'dark-content',
        // text
        titleText: colors.titleText,
        secondaryText: colors.secondaryText,
        },
    dark: {
        foreground: '#ffffff',
        background: '#222222',
        header: colors.darkHeader,
        primary: colors.darkPrimary,
        secondary: colors.darkSecondary,
        border:colors.darkBorder,
        pressable: colors.darkPressable,
        divider: colors.darkDivider,
        statusBarStyle:'light-content',
        //text
        titleText: colors.darkTitleText,
        secondaryText: colors.darkSecondaryText,
        },
    other: {
        header: colors.header,
        primary: colors.primary,
        secondary: colors.secondary,
        clearButton: colors.clearButton,
        opaqueClearButton: colors.opaqueClearButton,
        pressable: colors.pressable,
        // text
        titleText: colors.titleText,
    
        testRed: colors.red,
    },
};

const ThemeContext = React.createContext({
    theme: themes.light,
});

function ThemeProvider(props){
    const [theme, setTheme] = React.useState(themes.light);
    const toggleTheme = () => {
        setTheme(
            theme === themes.dark
              ? themes.light
              : themes.dark);	
    }
    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {props.children}
        </ThemeContext.Provider>
    );
    
}

export default ThemeContext;
export {ThemeProvider};
