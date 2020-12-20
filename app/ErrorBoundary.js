import React, { Component } from 'react';
import { Text, View } from 'react-native';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        logErrorToMyService(error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            // return <h1>Something went wrong.</h1>;
            return (
                <View>
                    <Text>Something went wrong.</Text>
                    <Text style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        {'\n'}
                        {this.state.errorInfo.componentStack}
                    </Text>
                </View>
            );
        }
        return this.props.children; 
    }
}

export default ErrorBoundary;