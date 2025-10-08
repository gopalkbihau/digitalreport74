
type SpeechState = {
    isSpeaking: boolean;
    isPaused: boolean;
};

export class SpeechService {
    private speechSynthesis: SpeechSynthesis;
    private onStateChange: (state: SpeechState) => void;
    private currentUtterance: SpeechSynthesisUtterance | null = null;

    constructor(onStateChange: (state: SpeechState) => void) {
        this.speechSynthesis = window.speechSynthesis;
        this.onStateChange = onStateChange;

        // Ensure we stop speaking if the page is closed/refreshed
        window.addEventListener('beforeunload', this.stop);
    }
    
    private updateState(isSpeaking: boolean, isPaused: boolean) {
        this.onStateChange({ isSpeaking, isPaused });
    }

    public speak = (text: string) => {
        if (this.speechSynthesis.speaking) {
            this.stop();
        }

        // Cleanup text to improve speech flow
        const cleanedText = text.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, ' ').trim();
        if (!cleanedText) return;
        
        this.currentUtterance = new SpeechSynthesisUtterance(cleanedText);
        this.currentUtterance.lang = 'en-US';
        this.currentUtterance.rate = 1;
        this.currentUtterance.pitch = 1;

        this.currentUtterance.onstart = () => {
            this.updateState(true, false);
        };
        
        this.currentUtterance.onend = () => {
            this.currentUtterance = null;
            this.updateState(false, false);
        };

        this.currentUtterance.onerror = (event: SpeechSynthesisErrorEvent) => {
            // The 'canceled' and 'interrupted' errors are not critical and can occur during normal operation (e.g., stopping speech).
            // We will not log them as errors to avoid console noise. Other errors will be logged with more detail.
            if (event.error !== 'canceled' && event.error !== 'interrupted') {
                console.error(`Speech synthesis error: ${event.error}`, event);
            }
            this.currentUtterance = null;
            this.updateState(false, false);
        };

        this.speechSynthesis.speak(this.currentUtterance);
    }

    public pause = () => {
        if (this.speechSynthesis.speaking && !this.speechSynthesis.paused) {
            this.speechSynthesis.pause();
            this.updateState(true, true);
        }
    }

    public resume = () => {
        if (this.speechSynthesis.paused) {
            this.speechSynthesis.resume();
            this.updateState(true, false);
        }
    }

    public stop = () => {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel(); // This will trigger 'onend' or 'onerror'
        }
        // Force state update in case onend doesn't fire (e.g., in some browser implementations)
        if (this.currentUtterance) {
            this.currentUtterance = null;
            this.updateState(false, false);
        }
    }

    public destroy = () => {
         window.removeEventListener('beforeunload', this.stop);
         this.stop();
    }
}
