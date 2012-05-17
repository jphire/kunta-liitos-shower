require 'json'
require 'csv_to_json'

class GraphController < ApplicationController
  
  respond_to :html, :json
  
  def show
    data = CSVData.new
    p = CsvToJson.new(data.get_all)
    @all_municipals = p.get_all_municipals
  end
  
  def json
    
    municipal_name = params[:id]
    data = CSVData.new
    p = CsvToJson.new(data.get_all)
    c = p.plot("Akaa")
    @json = c.to_json(:max_nesting => 10000)
    respond_with(@json)
  end
  
end
