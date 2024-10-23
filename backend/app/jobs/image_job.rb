require 'mini_magick'
require 'digest'
require 'net/http'
require 'uri'
require 'json'
require_relative '../services/push_notification_service'

class ImageJob < ApplicationJob
  queue_as :default
  
  def perform(name, push_token)
    require 'securerandom'

    output_image_name = "output_#{name}_#{SecureRandom.uuid}.jpg"
    image_path = Rails.root.join('public', 'images', 'default_image.jpg')
    output_path = Rails.root.join('public', 'images', "#{output_image_name}")

    image = MiniMagick::Image.open(image_path)

    # Cambiamos aquí para generar un color aleatorio del arcoíris
    color = generate_random_rainbow_color

    original_width = image.width
    original_height = image.height

    overlay = MiniMagick::Image.open(image_path)
    overlay.combine_options do |c|
      c.resize "#{original_width}x#{original_height}"
      c.fill "rgba(#{color},0.5)" 
      c.draw "rectangle 0,0,#{original_width},#{original_height}"
    end

    combined_image = image.composite(overlay) do |c|
      c.compose 'Over'
    end

    combined_image.combine_options do |c|
      c.gravity 'Center'
      c.font '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
      c.draw "text 0,0 '#{name}'"
      c.fill 'white'
      c.pointsize '48'
    end

    combined_image.write(output_path)

    PushNotificationService.send_notification(
      to: push_token,
      title: "Imagen generada para",
      body: "La imagen personalizada ha sido generada.",
      data: { imageUrl: "#{ENV['BACKEND_URL']}/images/#{output_image_name}", username: name }
    )
  end

  private

  # Nueva función para generar un color aleatorio del arcoíris
  def generate_random_rainbow_color
    hue = rand(0..360)  # Genera un ángulo aleatorio en el rango de 0 a 360
    saturation = 0.65   # Saturación fija
    lightness = 0.55    # Luminosidad fija

    r, g, b = hsl_to_rgb(hue, saturation, lightness)

    "#{r},#{g},#{b}"
  end

  def hsl_to_rgb(h, s, l)
    c = (1 - (2 * l - 1).abs) * s
    x = c * (1 - ((h / 60.0) % 2 - 1).abs)
    m = l - c / 2
    if h < 60
      r, g, b = c, x, 0
    elsif h < 120
      r, g, b = x, c, 0
    elsif h < 180
      r, g, b = 0, c, x
    elsif h < 240
      r, g, b = 0, x, c
    elsif h < 300
      r, g, b = x, 0, c
    else
      r, g, b = c, 0, x
    end
    [(r + m) * 255, (g + m) * 255, (b + m) * 255].map(&:round)
  end
end
