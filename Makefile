all: pdf

pdf: SveinbjornGeirsson.tex
	xelatex -interaction=nonstopmode SveinbjornGeirsson.tex
	xelatex -interaction=nonstopmode SveinbjornGeirsson.tex  # Second run for references

clean:
	rm -f *.aux *.log *.out *.pdf *.tmp

.PHONY: all pdf clean