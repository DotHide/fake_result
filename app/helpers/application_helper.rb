module ApplicationHelper
	def list_all_result
		@results = Result.all
	end

	def list_all_with_percent
		results = Result.all
		total_count = Result.sum(:count)
		@results_percent = []
		results.each do |result|
			result = {name: result.name, count: number_with_delimiter(result.count), percent: number_to_percentage((Float(result.count) / total_count) * 100, precision: 1)}
			@results_percent << result
		end
		@results_percent
	end
end
