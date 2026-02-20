import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput, StatusBar, SafeAreaView, TextStyle, ViewStyle } from 'react-native';

type Player = "X" | "O" | null;

type ThemeColors = {
  background: string;
  surface: string;
  text: string;
  border: string;
  primary: string;
  buttonText: string;
  error: string;
};

const themes: { [key: string]: ThemeColors } = {
  light: {
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#333333',
    border: '#333333',
    primary: '#007AFF',
    buttonText: '#ffffff',
    error: '#ff3b30',
  },
  dark: {
    background: '#1a1a1a',
    surface: '#2d2d2d',
    text: '#ffffff',
    border: '#ffffff',
    primary: '#0A84FF',
    buttonText: '#ffffff',
    error: '#ff453a',
  }
};

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const currentTheme = isDarkMode ? themes.dark : themes.light;
  const styles = getDynamicStyles(currentTheme);

  const handleLogin = () => {
    if (usernameInput.trim() === 'Mamadou') {
      setUser(usernameInput);
      setErrorMsg('');
    } else {
      setErrorMsg('Error: Username must be Mamadou');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setUsernameInput('');
    setErrorMsg('');
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={styles.centeredContent}>
          <Text style={styles.title}>Welcome</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            placeholderTextColor={isDarkMode ? '#888' : '#666'}
            value={usernameInput}
            onChangeText={(text) => {
              setUsernameInput(text);
              if (errorMsg) setErrorMsg('');
            }}
            autoCapitalize="none"
          />
          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.smallButton, { marginTop: 20 }]} 
            onPress={() => setIsDarkMode(!isDarkMode)}
          >
            <Text style={styles.smallButtonText}>
              Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Hi, {user}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.linkText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Game 
        styles={styles} 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
      />
    </SafeAreaView>
  );
}

interface GameProps {
  styles: ReturnType<typeof getDynamicStyles>;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

function Game({ styles, isDarkMode, toggleTheme }: GameProps) {
  const [squares, setSquares] = useState<Player[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  function handleClick(i: number) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  const winner = calculateWinner(squares);
  const status = winner 
    ? `Winner: ${winner}` 
    : squares.every(square => square !== null)
    ? "It's a draw!"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <View style={styles.centeredContent}>
      <Text style={styles.title}>Tic Tac Toe</Text>
      <Text style={styles.status}>{status}</Text>
      
      <View style={styles.grid}>
        <View style={styles.row}>
          <Square value={squares[0]} onPress={() => handleClick(0)} styles={styles} />
          <Square value={squares[1]} onPress={() => handleClick(1)} styles={styles} />
          <Square value={squares[2]} onPress={() => handleClick(2)} styles={styles} />
        </View>
        <View style={styles.row}>
          <Square value={squares[3]} onPress={() => handleClick(3)} styles={styles} />
          <Square value={squares[4]} onPress={() => handleClick(4)} styles={styles} />
          <Square value={squares[5]} onPress={() => handleClick(5)} styles={styles} />
        </View>
        <View style={styles.row}>
          <Square value={squares[6]} onPress={() => handleClick(6)} styles={styles} />
          <Square value={squares[7]} onPress={() => handleClick(7)} styles={styles} />
          <Square value={squares[8]} onPress={() => handleClick(8)} styles={styles} />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={resetGame}>
        <Text style={styles.buttonText}>Reset Game</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.smallButton} onPress={toggleTheme}>
        <Text style={styles.smallButtonText}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

interface SquareProps {
  value: Player;
  onPress: () => void;
  styles: ReturnType<typeof getDynamicStyles>;
}

function Square({ value, onPress, styles }: SquareProps) {
  return (
    <TouchableOpacity style={styles.square} onPress={onPress}>
      <Text style={styles.squareText}>{value}</Text>
    </TouchableOpacity>
  );
}

function calculateWinner(squares: Player[]): Player {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

const getDynamicStyles = (theme: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  } as ViewStyle,
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  } as ViewStyle,
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
  } as TextStyle,
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: theme.text,
  } as TextStyle,
  status: {
    fontSize: 20,
    marginBottom: 20,
    color: theme.text,
    opacity: 0.8,
  } as TextStyle,
  grid: {
    marginBottom: 20,
  } as ViewStyle,
  row: {
    flexDirection: 'row',
  } as ViewStyle,
  square: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.border,
    margin: 2,
    borderRadius: 4,
  } as ViewStyle,
  squareText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: theme.text,
  } as TextStyle,
  input: {
    width: '80%',
    padding: 15,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    marginBottom: 10,
    color: theme.text,
    backgroundColor: theme.surface,
  } as TextStyle,
  errorText: {
    color: theme.error,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '600',
  } as TextStyle,
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: theme.primary,
    borderRadius: 8,
    marginVertical: 10,
    minWidth: 150,
    alignItems: 'center',
  } as ViewStyle,
  buttonText: {
    color: theme.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,
  smallButton: {
    padding: 10,
    marginTop: 10,
  } as ViewStyle,
  smallButtonText: {
    color: theme.primary,
    fontSize: 16,
  } as TextStyle,
  linkText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle
});