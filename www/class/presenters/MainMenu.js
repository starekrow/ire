class MainMenuPresenter extends Presenter
{
    constructor()
    {
        super();
        this.fields.bind({
            
        });
    }

    start()
    {
        Game.pause();
        this.vp = new Viewport();
        // ...draw screen ...
    }

    startGame()
    {

    }

    viewOptions()
    {

    }

    quitGame()
    {

    }
    -
}