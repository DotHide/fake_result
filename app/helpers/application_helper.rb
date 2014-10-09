module ApplicationHelper
	def list_all_result
		@results = Result.order('count desc')
	end

	def list_all_with_percent
		results = Result.order('count desc')
		total_count = Result.sum(:count)
		@results_percent = []
		results.each do |result|
			result = {name: result.name, count: number_with_delimiter(result.count), percent: number_with_precision((Float(result.count) / total_count) * 100, precision: 1)}
			@results_percent << result
		end
		@results_percent
	end

	def list_all_with_percent_top10
		results = Result.order('count desc')
		total_count = Result.sum(:count)
		@results_percent = []
		others = {}
		others_total_count = 0
		results.each_with_index do |result, index|
			if index < 10
				result = {name: result.name, count: number_with_delimiter(result.count), percent: number_with_precision((Float(result.count) / total_count) * 100, precision: 1)}
				@results_percent << result
			else
				others_total_count += result.count
			end
		end
		@results_percent << {name: '其他选项', count: 0, percent: number_with_precision((Float(others_total_count) / total_count) * 100, precision: 1)}
		@results_percent
	end
end
