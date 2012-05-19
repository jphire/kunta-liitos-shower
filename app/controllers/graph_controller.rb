require 'json'
require 'csv_to_json'

class GraphController < ApplicationController
  
  respond_to :html, :json
  def initialize
  	@data = CSVData.new
    @p = CsvToJson.new(@data.get_all)
    super
  end
  
  def show
    @all_municipals = @p.get_all_municipals
  end
  
  def json 
    municipal_name = params[:id]
    c = @p.plot(municipal_name)
    @json = c.to_json(:max_nesting => 10000)
    respond_with(@json)
  end
  
end
