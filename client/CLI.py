import requests
import time

username = ""
password = ""
input_data = {'square9': 0, 'square8': 0, 'square7': 0, 'square6': 0, 'square5': 0, 'square4': 0, 'square3': 0, 'square2': 0, 'square1': 0}
playerNumber = 0

num_to_square = {
    '1':"square1",
    '2':"square2",
    '3':"square3",
    '4':"square4",
    '5':"square5",
    '6':"square6",
    '7':"square7",
    '8':"square8",
    '9':"square9"
}

api_gateway_endpoint = "https://hjb1xuy2zj.execute-api.us-west-2.amazonaws.com/prod"
id_token = None


def update_board(input_data):
    board = [
        [input_data["square1"], input_data["square2"], input_data["square3"]],
        [input_data["square4"], input_data["square5"], input_data["square6"]],
        [input_data["square7"], input_data["square8"], input_data["square9"]]
    ]

    winner = check_winner(board)
    if winner:
        if winner == 1:
            print('X has won')
        elif winner == 2:
            print('O has won')
        else:
            print('It is a Tie')
        print_board(board)
        exit()
    else:
        print('Updated Board:')
        print_board(board)


def check_winner(board):
    for i in range(3):
        if board[i][0] != 0 and board[i][0] == board[i][1] == board[i][2]:
            return board[i][0]

        if board[0][i] != 0 and board[0][i] == board[1][i] == board[2][i]:
            return board[0][i]

    if board[0][0] != 0 and board[0][0] == board[1][1] == board[2][2]:
        return board[0][0]

    if board[0][2] != 0 and board[0][2] == board[1][1] == board[2][0]:
        return board[0][2]
    is_tie = 0
    for i in range(3):
        for j in range(3):
            if(board[i][j] != 0):
                is_tie = is_tie + 1
    if is_tie == 9:
        return 'tie'

    return None


def print_board(board):
    for i in range(len(board)):
        row = ''
        for j in range(len(board[i])):
            if j > 0:
                row += '|'
            symbol = ''
            if board[i][j] == 1:
                symbol = 'X'
            elif board[i][j] == 2:
                symbol = 'O'
            else:
                symbol = '-'
            row += f' {symbol} '
        print(row)
        if i < len(board) - 1:
            print('---+---+---')


def prompt_user():
    while True:
        user_input = input('Enter Login if you have an account or Register to create one: ').lower().strip()
        if user_input in {'login', 'register'}:
            return user_input
        else:
            print('Invalid input. Please enter either "Login" or "Register".')


def option_check():
    while True:
        user_input = input('Enter Host to create a game or Join to join an existing game: ').lower().strip()
        if user_input in {'host', 'join'}:
            return user_input
        else:
            print('Invalid input. Please enter either "host" or "join".')


def login(username, password):
    global id_token
    print(f'Logging in with username: {username} and password: {password}')
    request_body = {
        "username": username,
        "password": password
    }

    response = requests.post(api_gateway_endpoint + "/login", json=request_body)
    if response.status_code == 200:
        print('Request sent successfully.')
        id_token = response.json().get('idToken')
    else:
        print('Invalid credentials')
        exit()


def register(username, password, email):
    print(f'Registering user with username: {username}, password: {password}, and email: {email}')
    request_body = {
        "email": email,
        "password": password,
        "username": username
    }

    response = requests.post(api_gateway_endpoint + "/users", json=request_body)
    if response.status_code == 200:
        print('Request sent successfully.')
    else:
        print('Invalid credentials')
        exit()


def host(email):
    global input_data
    global playerNumber
    print(f'Hosting game against user with email: {email}')
    headers = {
        "Content-Type": "application/json",
        "Authorization": id_token
    }
    request_body = {
        "opponent": email
    }

    response = requests.post(api_gateway_endpoint + "/games", json=request_body, headers=headers)
    if response.status_code == 200:
        print('Request sent successfully.')
        playerNumber = 1
        input_data = response.json()
    else:
        print('Invalid email address')
        exit()


def join(game_id):
    global input_data
    global playerNumber
    print(f'Joining game with game_id: {game_id}')
    headers = {
        "Content-Type": "application/json",
        "Authorization": id_token
    }
    request_body = {
        "gameId": game_id
    }

    response = requests.post(api_gateway_endpoint + "/users/update", json=request_body, headers=headers)
    if response.status_code == 200:
        print('Request sent successfully.')
        playerNumber = 2
        input_data = response.json()
        update_board(input_data)
    else:
        print('Invalid gameId')
        exit()

def move(square_value):
    global input_data
    headers = {
        "Content-type": "application/json",
        "Authorization": id_token
    }
    request_body = {
        "changedSquare": num_to_square[square_value],
        "changedSquareValue": playerNumber
    }
    response = requests.post(api_gateway_endpoint + '/games/' + input_data['gameId'], json=request_body, headers=headers)
    if response.status_code == 200:
        print('Request sent successfully.')
        input_data = response.json()
        update_board(input_data)
    else:
        print('Error sending move request:')
        print (response)

def fetch(gameId):
    global input_data
    response = requests.get(api_gateway_endpoint + '/games/' + gameId)
    if input_data == response.json():
        return
    input_data = response.json()
    update_board(input_data)



def handle_login():
    global username, password
    username = input('Enter username: ')
    password = input('Enter password: ')


def handle_register():
    global username, password
    print("Username must be 4 characters, Password must be 8 characters with a Capital and a number")
    username = input('Enter username: ')
    password = input('Enter password: ')
    email = input('Enter email: ')
    return {'username': username, 'password': password, 'email': email}


def handle_host():
    email = input('Enter email: ')
    return {'email': email}


def handle_join():
    game_id = input('Enter game_id: ')
    return {'game_id': game_id}


def handle_square():
    square = input('Enter square number (1-9): ')
    squareValue = num_to_square[square]
    if input_data[squareValue] != 0:
        print("That square is already filled!")
        square = handle_square()
    return square


def main():
    global input_data
    try:
        valid = False
        while not valid:
            user_input = prompt_user()
            print(f'You selected: {user_input}')
            if user_input == 'login':
                valid = True
                handle_login()
                login(username, password)
            elif user_input == 'register':
                user_data = handle_register()
                register(user_data['username'], user_data['password'], user_data['email'])

        valid = False
        while not valid:
            option = option_check()
            print(f'You selected: {option}')
            if option == 'host':
                valid = True
                host_data = handle_host()
                host(host_data['email'])
            elif option == 'join':
                valid = True
                join_data = handle_join()
                join(join_data['game_id'])

        while True:
            while input_data['lastMoveBy'] == username:
                time.sleep(10)
                fetch(input_data['gameId'])
            selected_square = handle_square()
            print(f'Selected square: {selected_square}')
            if 0 < int(selected_square) < 10:
                move(selected_square)
            else:
                print('This is not a valid square')

    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()
