require 'csv_to_json'

class GraphController < ApplicationController
  def show
    data = CSVData.new
    p = CsvToJson.new(data.get_all)
    @municipals = get_all_municipals
  end
end
