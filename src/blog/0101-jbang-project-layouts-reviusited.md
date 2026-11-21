---
layout: blog-layout.pug
date: 2026-11-20
tags:
  - posts
  - shorts
  - project structure
  - java
  - javafx
  - jbang
draft: false
---
# Notes on structuring jbang-based projects

How much _jazz_ you can do when configuring a modern java project using jbang?
Let's find out!

## Why jbang at all?

I already did a [detailed introduction][jb-article] some time ago, so you can
check it out.

[jb-article]: ../0095-java-small-to-big-with-jbang

But the TL;DR; is:

- Simplicity
- Flexibility
- Fine-grained environment and supply chain control
- Ai-friendly

## Motivation

[JBang][jbang] scales well uo and down in the complexity tree, but a few
guidelines are important in order to keep a familiar workflow for those already
versed in popular java IDEs and other java build systems.

[jbang]: https://jbang.dev/

## Project layouts we'll explore

- Bare-bones script
- Simple source folder
- Maven-like layout
- Deps spread across multiple files

## Key questions about these layouts

- Does it behave well with jbang itself?
- The export options produces usable maven/grade/IDE configurations?
- How well it behaves with [the official intellij jbang plugin][jbidea]?

[jbidea]: https://plugins.jetbrains.com/plugin/18257-jbang

## Bare Bones

Basic jbang usage: one single script.

### Initial Setup

```bash
jbang init --java 17 --deps=tools.jackson.core:jackson-databind:3.3.0 Bare.java
```

### How to run

```bash
jbang run Bare.java
```

### Project export results

By running:

```bash
jbang export gradle Bare.java
```

A perfectly valid gradle project is produced, no major issues. The same is 
valid for `jbang export maven`.

### Intellij jbang plugin

This is the basic case for the plugin. Works perfectly.

### Noteworthy

- If you define the `Item` record outise the `Bare.java` script, you need to 
  add the `//SOURCES Item.java` directive to the script.

## Simple source folder

Everything in a `src` folder.

### Initial Setup

```bash
mkdir -p src/sample
jbang init --java 11\
 --deps=com.google.code.gson:gson:2.15.0\
 src/sample/Simple.java
touch src/sample/Item.java
```

### How to run

```bash
jbang run src/sample/Simple.java
```

### Project export

```bash
jbang export maven src/sample/Simple.java
```

Which works as expected.

### Jbang plugin integration

Also works as expected, with a small note.

### Noteworthy

- In IDE configuration, the `src` folder must added as source folder.
- But then, the IDE will scan and identify all classes and packagers, but jbang 
  fails if `//SOURCES Item.java` isn't present in the main script. Without it, 
  jbang does not see the other class in the package, even project export fais. 
  The **IDE** says that everything if fine but the project does not run.

## Maven-like

The `src/{main,test}/{java,resources}` directory structure.

### Initial Setup

```bash
mkdir -p src/{main,test}/{java,resources}
mkdir -p src/{main,test}/java/org/example/{cart,model}
touch src/main/java/org/example/model/{Product,Customer}.java
touch src/main/java/org/example/cart/{CartItem,Cart}.java
touch src/test/java/org/example/cart/CartTest.java
touch src/{main,test}/resources/application.yaml
jbang init --deps=tools.jackson.dataformat:jackson-dataformat-yaml:3.1.1\
 --java 25\
 src/main/java/org/example/App.java
jbang init --deps=tools.jackson.dataformat:jackson-dataformat-yaml:3.1.1,\
org.hamcrest:hamcrest:3.0,\
org.junit.jupiter:junit-jupiter:6.1.3,\
org.junit.platform:junit-platform-console-standalone:6.1.3\
 src/test/java/org/example/AppTest.java
```

### How to run

```bash
jbang src/main/java/org/example/App.java
```

### How to test

```bash
jbang src/test/java/org/example/AppTest.java
```

### Project export

```bash
jbang export gradle src/main/java/org/example/App.java
```

### Intellij integration

Using this layout with two entrypoints, the plugin works flawlessly, syncing 
the classpath accordingly to the current entrypoint. If it complains about a 
missing package, simply sync the project and make sure that the correct jbang 
root is selected.

Once source, resource and test folders get proper setup, both entrypoints 
deliver a good IDE/autocomplete experience.

But individual testcase execution does not work like standard intellij 
projects. For those scenarios, the project export and manual copy of test
resources and sources are the best approach for now.

### Noteworthy

- For this example, two different enty points where provisioned. But the test 
  one also includes sources and resources from the first. That way, the regular 
  classpath doesn't get polluted with test-specific classes.
- For some reason the resource folders does not produce the overrides people 
  expect from maven/gradle. Need more investigation on that.
- The test entry point fails to export a valid project.

## Spread deps

It is possible, but not sure if it's a good idea.

Instead of centralize all deps at the entry point, deps appear closet to whare 
they will be consumed.

### Initial Setup

```bash
mkdir -p src/org/example/{model,service,ui}
mkdir resources
touch src/org/example/service/Orders.java
touch src/org/example/ui/Checkout.java
touch src/org/example/model/{Order,Item}.java
touch resources/application.properties
jbang init --java 21 \
--deps=org.junit.platform:junit-platform-console-standalone:6.1.3 \
src/Project.java
```

The initial setup does not declare all dependencies that will be needed.
Instead, they will appear Whenever needed. For example, the `Project.java` acts
an entry point for distinc operations inside the project:

```java
/// usr/bin/env jbang "$0" "$@" ; exit $?
//JAVA 21
//DEPS org.junit.platform:junit-platform-console-standalone:6.1.3
//SOURCES **/*.java
//FILES ../resources

import org.example.ui.Checkout;
import org.junit.platform.console.ConsoleLauncher;

import static java.lang.System.out;

public class Project {

    public static void main(String... args) {
        if (args.length == 0)
            out.println("missing argument: run|test");
        else if ("test".equals(args[0]))
            ConsoleLauncher.main("execute", "--select-package", "org.example");
        else if ("run".equals(args[0]))
            Checkout.main();
    }
}
```

Then the `Checkout.java`, our app entrypoint, declares himself the needed deps:

```java
//DEPS org.openjfx:javafx-controls:21.0.9
//DEPS org.openjfx:javafx-fxml:21.0.8
//DEPS io.github.mkpaz:atlantafx-base:2.0.1

package org.example.ui;

import atlantafx.base.theme.PrimerDark;
import javafx.application.Application;
import javafx.beans.binding.Bindings;
import javafx.beans.property.ObjectProperty;
import javafx.beans.property.SimpleObjectProperty;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.collections.transformation.FilteredList;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.ListCell;
import javafx.scene.control.ListView;
import javafx.scene.control.TextField;
import javafx.scene.layout.HBox;
import javafx.stage.Stage;
import javafx.util.Callback;
import org.example.model.Item;
import org.example.model.Order;
import org.example.service.Orders;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.function.Predicate;

public class Checkout extends Application {

    // language=FXML
    private static final String FXML_TEMPLATE = """
            <?xml version="1.0" encoding="UTF-8"?>
            <?import javafx.geometry.*?>
            <?import javafx.scene.control.*?>
            <?import javafx.scene.layout.*?>
            <HBox spacing="16" prefWidth="950" prefHeight="550"
                  xmlns="http://javafx.com"
                  xmlns:fx="http://javafx.com">
                <padding>
                    <Insets top="16" right="16" bottom="16" left="16"/>
                </padding>
                <VBox spacing="8" HBox.hgrow="ALWAYS" prefWidth="280">
                    <Label text="Pedidos (Orders)" style="-fx-font-weight: bold; -fx-font-size: 14px;"/>
                    <TextField fx:id="txtBuscarOrder" promptText="Filtrar por cliente..."/>
                    <ListView fx:id="listOrders" VBox.vgrow="ALWAYS"/>
                </VBox>
                <VBox spacing="12" HBox.hgrow="ALWAYS" prefWidth="340">
                    <VBox spacing="8">
                        <Label text="Detalhes do Pedido" style="-fx-font-weight: bold; -fx-font-size: 14px;"/>
                        <Label text="Cliente:"/>
                        <TextField fx:id="txtClient" promptText="Nome do cliente"/>
                        <HBox spacing="8">
                            <Button fx:id="btnLimparOrder" text="Limpar" maxWidth="Infinity" HBox.hgrow="ALWAYS"/>
                            <Button fx:id="btnSalvarOrder" text="Salvar" maxWidth="Infinity" HBox.hgrow="ALWAYS"/>
                            <Button fx:id="btnExcluirOrder" text="Excluir" maxWidth="Infinity" HBox.hgrow="ALWAYS"/>
                        </HBox>
                    </VBox>
                    <Separator/>
                    <VBox spacing="8" VBox.vgrow="ALWAYS">
                        <Label text="Itens do Pedido" style="-fx-font-weight: bold; -fx-font-size: 14px;"/>
                        <ListView fx:id="listItems" VBox.vgrow="ALWAYS"/>
                    </VBox>
                </VBox>
                <VBox spacing="8" HBox.hgrow="ALWAYS" prefWidth="280">
                    <Label text="Detalhes do Item" style="-fx-font-weight: bold; -fx-font-size: 14px;"/>
                    <Label text="Descrição:"/>
                        <TextField fx:id="txtItemDescription" promptText="Descrição do item"/>
                    <Label text="Quantidade:"/>
                    <TextField fx:id="txtItemQuantity" promptText="0"/>
                    <HBox spacing="8">
                        <Button fx:id="btnLimparItem" text="Limpar" maxWidth="Infinity" HBox.hgrow="ALWAYS"/>
                        <Button fx:id="btnSalvarItem" text="Salvar" maxWidth="Infinity" HBox.hgrow="ALWAYS"/>
                        <Button fx:id="btnExcluirItem" text="Excluir" maxWidth="Infinity" HBox.hgrow="ALWAYS"/>
                    </HBox>
                </VBox>
            </HBox>
            """;

    private final Orders orders = new Orders();

    private final ObservableList<Order> masterOrders = FXCollections.observableArrayList();
    private final ObjectProperty<Order> currentOrder = new SimpleObjectProperty<>(novoOrderVazio());
    private final ObjectProperty<Item> currentItem = new SimpleObjectProperty<>(novoItemVazio());
    private Order savedOrder = novoOrderVazio();

    @FXML
    private TextField txtBuscarOrder;
    @FXML
    private ListView<Order> listOrders;
    @FXML
    private TextField txtClient;
    @FXML
    private Button btnLimparOrder;
    @FXML
    private Button btnSalvarOrder;
    @FXML
    private Button btnExcluirOrder;
    @FXML
    private ListView<Item> listItems;
    @FXML
    private TextField txtItemDescription;
    @FXML
    private TextField txtItemQuantity;
    @FXML
    private Button btnLimparItem;
    @FXML
    private Button btnSalvarItem;
    @FXML
    private Button btnExcluirItem;

    @FXML
    private void initialize() {
        configurarCelulas();
        configurarFluxoReativo();
        configurarAcoesOrder();
        configurarAcoesItem();

        masterOrders.setAll(orders.list(""));
    }

    private void configurarCelulas() {
        listOrders.setCellFactory(criarCelulas(
                order -> order.client() + " ("
                        + (order.items() == null ? 0 : order.items().size()) + " itens)"
        ));
        listItems.setCellFactory(criarCelulas(
                item -> item.quantity() + "x " + item.description()
        ));
    }

    private <T> Callback<ListView<T>, ListCell<T>> criarCelulas(Function<T, String> formatar) {
        return lv -> new ListCell<>() {
            @Override
            protected void updateItem(T valor, boolean empty) {
                super.updateItem(valor, empty);
                setText(empty || valor == null ? null : formatar.apply(valor));
            }
        };
    }

    private void configurarFluxoReativo() {
        FilteredList<Order> filteredOrders = new FilteredList<>(masterOrders);
        filteredOrders.predicateProperty().bind(
                txtBuscarOrder.textProperty().map(this::criarFiltroCliente)
        );
        listOrders.setItems(filteredOrders);
        listOrders.getSelectionModel().selectedItemProperty().subscribe(selecionado -> {
            if (selecionado != null) {
                savedOrder = selecionado;
                currentOrder.set(selecionado);
                prepararNovoItem();
            }
        });
        currentOrder.map(Order::client)
                .orElse("")
                .subscribe(txtClient::setText);
        listItems.itemsProperty().bind(
                currentOrder
                        .map(order -> order.items() == null ? List.<Item>of() : List.copyOf(order.items()))
                        .map(FXCollections::observableArrayList)
                        .orElse(FXCollections.emptyObservableList()));
        listItems.getSelectionModel().selectedItemProperty().subscribe(selecionado -> {
            if (selecionado != null) {
                currentItem.set(selecionado);
            }
        });
        currentItem.map(Item::description)
                .orElse("")
                .subscribe(txtItemDescription::setText);
        currentItem.map(item -> String.valueOf(item.quantity()))
                .subscribe(txtItemQuantity::setText);
    }

    private void configurarAcoesOrder() {
        btnSalvarOrder.disableProperty().bind(
                Bindings.createBooleanBinding(
                        () -> txtClient.getText() == null || txtClient.getText().isBlank(),
                        txtClient.textProperty()
                )
        );
        btnExcluirOrder.disableProperty().bind(
                Bindings.createBooleanBinding(
                        () -> savedOrder == null || !masterOrders.contains(savedOrder),
                        currentOrder, masterOrders
                )
        );
        btnLimparOrder.setOnAction(e -> prepararNovoOrder());
        btnSalvarOrder.setOnAction(e -> {
            if (savedOrder != null && masterOrders.contains(savedOrder)) {
                orders.remove(savedOrder);
            }
            Set<Item> itensAtuais = new HashSet<>(listItems.getItems());
            Order salvo = new Order(txtClient.getText().trim(), itensAtuais);
            orders.save(salvo);
            savedOrder = salvo;

            txtBuscarOrder.setText("");
            masterOrders.setAll(orders.list(""));
            prepararNovoOrder();
        });
        btnExcluirOrder.setOnAction(e -> {
            if (savedOrder != null && masterOrders.contains(savedOrder)) {
                orders.remove(savedOrder);
                masterOrders.setAll(orders.list(""));
                prepararNovoOrder();
            }
        });
    }

    private void configurarAcoesItem() {
        btnSalvarItem.disableProperty().bind(
                Bindings.createBooleanBinding(
                        this::itemInvalido,
                        txtItemDescription.textProperty(),
                        txtItemQuantity.textProperty()
                )
        );
        btnExcluirItem.disableProperty().bind(
                Bindings.createBooleanBinding(
                        () -> currentItem.get() == null
                                || listItems.getItems() == null
                                || !listItems.getItems().contains(currentItem.get()),
                        currentItem,
                        listItems.itemsProperty()
                )
        );
        btnLimparItem.setOnAction(e -> prepararNovoItem());
        btnSalvarItem.setOnAction(e -> {
            if (itemInvalido()) {
                return;
            }
            Item antigo = currentItem.get();
            Set<Item> itens = new HashSet<>(listItems.getItems());
            if (antigo != null) {
                itens.remove(antigo);
            }
            Item salvo = new Item(
                    txtItemDescription.getText().trim(),
                    Integer.parseInt(txtItemQuantity.getText().trim())
            );
            itens.add(salvo);
            atualizarItensDoPedido(itens);
            prepararNovoItem();
        });
        btnExcluirItem.setOnAction(e -> {
            Item alvo = currentItem.get();
            if (alvo != null && listItems.getItems().contains(alvo)) {
                Set<Item> itens = new HashSet<>(listItems.getItems());
                itens.remove(alvo);
                atualizarItensDoPedido(itens);
                prepararNovoItem();
            }
        });
    }

    private boolean itemInvalido() {
        String descricao = txtItemDescription.getText();
        String quantidade = txtItemQuantity.getText();
        if (descricao == null || descricao.isBlank() || quantidade == null || quantidade.isBlank()) {
            return true;
        }
        try {
            return Integer.parseInt(quantidade.trim()) < 1;
        } catch (NumberFormatException excecao) {
            return true;
        }
    }

    private void atualizarItensDoPedido(Set<Item> itens) {
        currentOrder.set(new Order(
                txtClient.getText().trim(),
                itens
        ));
    }

    private void prepararNovoOrder() {
        listOrders.getSelectionModel().clearSelection();
        savedOrder = novoOrderVazio();
        currentOrder.set(novoOrderVazio());
        txtClient.clear();
        prepararNovoItem();
        txtClient.requestFocus();
    }

    private void prepararNovoItem() {
        listItems.getSelectionModel().clearSelection();
        currentItem.set(novoItemVazio());
        txtItemDescription.clear();
        txtItemQuantity.clear();
        txtItemDescription.requestFocus();
    }

    private Order novoOrderVazio() {
        return new Order("", Set.of());
    }

    private Item novoItemVazio() {
        return new Item("", 0);
    }

    private Predicate<Order> criarFiltroCliente(String query) {
        return order -> query == null || query.isBlank()
                || (order.client() != null && order.client().toLowerCase().contains(query.toLowerCase()));
    }

    @Override
    public void start(Stage stage) throws Exception {
        Application.setUserAgentStylesheet(new PrimerDark().getUserAgentStylesheet());
        FXMLLoader loader = new FXMLLoader();
        loader.setController(this);
        try (var stream = new ByteArrayInputStream(FXML_TEMPLATE.getBytes(StandardCharsets.UTF_8))) {
            HBox root = loader.load(stream);
            stage.setTitle("JavaFX + JBang example");
            stage.setScene(new Scene(root));
            stage.show();
        }
    }

    public static void main(String... args) {
        launch(args);
    }
}
```

You got the idea.

### How to run

```bash
jbang src/Project.java run
```

### How to test

```bash
jbang src/Project.java test
```

### Project export result

Both `jbang export maven src/Project.java` and
`jbang export gradle src/Project.java` produces _almost_ valid projects. Since 
there are several duplicated `//DEPS` entries all over the project, those 
duplicates also lands in `build.gradle` and `pom.xml`. That is, however, not a 
deal-breaker like the export failure due to files with the same name as seen in 
the [maven-like][maven-like] experiment.

[maven-like]: https://github.com/sombriks/project-layouts-jbang

### Intellij plugin behavior

The plugin works with no surprises, jbang is flexible enough to allow some 
degree of _jazz_ in project setup. However, each file containing a `//DEPS` 
directive is considered a jbang root. This might become troublesome, since the 
real root remains being the `Project.java` script.

Have the dependencies declared next to where they are used has mostly 
educational value, therefore makes little sense to pollute the jbang 
project with several possible faulty roots.

Again, for jbang itself that's completely fine. The IDEs are the ones failing 
to keep up with.

### Noteworthy

- One thing to really avoid is bad `//SOURCES` patterns. A
  `//SOURCES src/**/*.java` with the jbang root outside the `src` folder will 
  run just fine with jbang, but the ide will collapse in classpath errors, 
  unable to find classes that where supposed to be in the same package.
- The single root with distinct options to run and test approach avoid the 
  convoluted configuration seen in the [maven-like][maven-like] experiment.

## Conclusion

Further experimentation is needed. There is so much of what jbang can do that i
didn't covered yet, but what is already presented show how clean a java project
can really be if people get able to see beyond gradle and maven.

Happy hacking!
