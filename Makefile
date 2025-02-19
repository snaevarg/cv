.PHONY: all icelandic english clean

# Default target builds both versions
all: icelandic english

# Build Icelandic version
icelandic:
	./build.sh -l icelandic

# Build English version
english:
	./build.sh -l english

# Build both versions
both:
	./build.sh -l both

# Clean temporary files and PDFs
clean:
	rm -f *.aux *.log *.out "Sveinbj"*".pdf"
