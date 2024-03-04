class AddCancelUrlToCharges < ActiveRecord::Migration[6.1]
  def change
    add_column :charges, :cancel_url, :string
  end
end
