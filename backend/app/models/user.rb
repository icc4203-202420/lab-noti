class User < ApplicationRecord
    has_secure_password
    validates :username, presence: true, uniqueness: true
    validates :email, presence: true, uniqueness: { case_sensitive: false }
    validates :push_token, presence: false
  
    before_save :downcase_email
  
    private
  
    def downcase_email
      self.email = email.downcase if email.present?
    end
  end
  