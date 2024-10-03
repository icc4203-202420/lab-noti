class UsersController < ApplicationController
    # Registro de nuevo usuario
    def create
      user = User.new(user_params)
      if user.save
        render json: { message: "Usuario creado correctamente", user: user }, status: :created
      else
        render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    # Inicio de sesión
    def login
      user = User.find_by(email: params[:email])
      push_token = params[:push_token]

      

      if user && user.authenticate(params[:password])
        if push_token
          user.update(push_token: push_token)
        end
        render json: { message: "Inicio de sesión exitoso", user: user }
      else
        render json: { errors: "Email o contraseña incorrectos" }, status: :unauthorized
      end
    end
  
    # Mostrar un usuario por ID
    def show
      user = User.find(params[:id])
      if user
        render json: user
      else
        render json: { errors: "Usuario no encontrado" }, status: :not_found
      end
    end
  
    # Listar todos los usuarios
    def index
      users = User.all
      render json: users
    end
  
    private
  
    # Filtro de parámetros permitidos
    def user_params
      params.require(:user).permit(:username, :email, :password, :push_token)
    end
end
  