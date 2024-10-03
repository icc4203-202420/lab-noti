require_relative '../services/push_notification_service'

class BeersController < ApplicationController

  def create
    user_id = params[:user_id]  
    user = User.find_by(id: user_id)

    if user.present?
      name = user.username 
      push_token = user.push_token
      BeerImageJob.perform_later(name, push_token)
      render json: { message: "La imagen para #{name} se está generando." }, status: :accepted
    else
      render json: { error: "Usuario no encontrado." }, status: :not_found
    end
  end



  def destroy
    user_id = params[:id]  
    user = User.find_by(id: user_id) 

    puts user_id
    puts user

    if user.present?
      name = user.username
    end

    image_path = Rails.root.join("public/images/output_#{name}.jpg")

    if File.exist?(image_path)
      File.delete(image_path)
      render json: { message: "Imagen eliminada correctamente." }, status: :ok
    else
      render json: { error: "Imagen no encontrada." }, status: :not_found
    end
  end


  def share
    user_id_to_exclude = params[:id] 
    user = User.find_by(id: user_id_to_exclude)

    if user.nil?
      render json: { error: "Usuario no encontrado." }, status: :not_found
      return
    end

    users_to_notify = User.where.not(id: user_id_to_exclude).where.not(push_token: nil)
    # users_to_notify = User.all

    users_to_notify.each do |recipient|
      PushNotificationService.send_notification(
        to: recipient.push_token,
        title: "El usuario #{user.username} compartió su foto contigo",
        body: "El usuario #{user.username} ha compartido su foto.",
        data: { image_url: "http://192.168.1.32:3000/images/output_#{user.username}.jpg" }
      )
    end

    render json: { message: "Notificación enviada a los usuarios." }, status: :ok
  end

end
