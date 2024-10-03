# app/services/push_notification_service.rb
class PushNotificationService
    def self.send_notification(to:, title:, body:, data:)
      message = {
        to: to,
        sound: 'default',
        title: title,
        body: body,
        data: data
      }
  
      url = URI.parse('https://exp.host/--/api/v2/push/send')
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true
  
      request = Net::HTTP::Post.new(url.path, { 'Content-Type' => 'application/json' })
      request.body = message.to_json
  
      response = http.request(request)
  
      if response.is_a?(Net::HTTPSuccess)
        Rails.logger.info("Notificación enviada con éxito a #{to}")
      else
        Rails.logger.error("Error enviando notificación: #{response.body}")
      end
    end
  end
  