loop do
  begin
    say eval ask 'YOLO: '
    break
  rescue => e
    say "#{e.class}: #{e.message}"
  end
end

# tags: yolo, coAIthored