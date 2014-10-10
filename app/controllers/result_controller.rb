class ResultController < ApplicationController
  def edit
  	@result = Result.find(params[:id])
  end

  def update
  	@result = Result.find(params[:id])
  	count = @result.count + params[:result][:count].to_i
  	if @result.update(:count => count)
  		render :edit
  	else
  		redirect_to home_path
  	end
  end

  def index
    @results = Result.all
  end
end
