require 'mini_magick'
require 'digest'
require 'net/http'
require 'uri'
require 'json'
require_relative '../services/push_notification_service'


class BeerImageJob < ApplicationJob
  queue_as :default

  def perform(name, push_token)
    image_path = Rails.root.join('public', 'images', 'default_image.jpg')
    output_path = Rails.root.join('public', 'images', "output_#{name}.jpg")

    image = MiniMagick::Image.open(image_path)

    color = generate_color_from_name(name)

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
      c.draw "text 0,0 '#{name}'"
      c.fill 'white'
      c.pointsize '32'
    end

    combined_image.write(output_path)

    PushNotificationService.send_notification(
      to: push_token,
      title: "Imagen generada para #{name}",
      body: "La imagen personalizada ha sido generada.",
      data: { image_url: "http://192.168.1.32:3000/images/output_#{name}.jpg" }
    )

  end

  private


  def generate_color_from_name(name)
    hash = Digest::MD5.hexdigest(name)
    r = hash[0..1].to_i(16) % 256
    g = hash[2..3].to_i(16) % 256
    b = hash[4..5].to_i(16) % 256

    h, s, l = rgb_to_hsl(r, g, b)

    h = (h * 360).round % 360
    s = 0.65 
    l = 0.55 

    r, g, b = hsl_to_rgb(h, s, l)

    "#{r},#{g},#{b}"
  end

  def rgb_to_hsl(r, g, b)
    r /= 255.0
    g /= 255.0
    b /= 255.0
    max = [r, g, b].max
    min = [r, g, b].min
    l = (max + min) / 2.0

    if max == min
      h = s = 0 
    else
      d = max - min
      s = l > 0.5 ? d / (2.0 - max - min) : d / (max + min)

      case max
      when r
        h = (g - b) / d + (g < b ? 6 : 0)
      when g
        h = (b - r) / d + 2
      when b
        h = (r - g) / d + 4
      end
      h /= 6.0
    end
    [h, s, l]
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
